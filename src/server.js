import * as dotenv from 'dotenv';
dotenv.config();

import process from 'node:process';
import fastify from 'fastify';
import { connect as connectDb } from './db/database.js';
import { connect as connectMemstore } from './db/memstore.js';
import { start as startStatCounter } from './lib/usage.js';
import { registerRoutes } from './api/index.js';

const app = fastify({ logger: true, disableRequestLogging: true });
global.log = app.log;

registerRoutes(app);

const start = async () => {
  try {
    await connectDb(process.env.IPLKUP_MONGO_DB_URL);
    global.log.info('Connected to database store.');

    global.memstore = await connectMemstore(process.env.IPLKUP_REDIS_CACHE_DB_URL);
    global.log.info('Connected to in-memory data store.');

    global.statStore = await connectMemstore(process.env.IPLKUP_REDIS_STATS_DB_URL);
    global.log.info('Connected to in-memory stats store.');
    await startStatCounter();

    app.listen({ port: process.env.IPLKUP_APP_PORT });
    global.log.info(`Started app server on port ${process.env.IPLKUP_APP_PORT}`);

  } catch (err) {
    global.log.error(err, 'Failed to start app server.');
    process.exit(1);
  }
};

// exit safely to clean up any aquired resources i.e. db connection
const stop = () => {
  global.log.info('Shutting down server...');

  try {
    global.database?.disconnect();
  } catch (err) {
    global.log.error(err, 'Failed to close database store connection.');
  }

  try {
    global.memstore?.quit();
  } catch (err) {
    global.log.error(err, 'Failed to close in-memory data connection.');
  }

  try {
    global.statStore?.quit();
  } catch (err) {
    global.log.error(err, 'Failed to close in-memory stat store connection.');
  }

  process.exit();
};

// register cleanup events
process.on('SIGTERM', stop); // ctrl c
process.on('SIGINT', stop); // ctrl z
process.on('uncaughtException', (err) => {
  global.log.fatal(err.stack);
  stop();
});

start();
