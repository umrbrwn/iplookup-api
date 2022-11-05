/**
 * Use this utility to import data from CSV file.
 * 
 * Considerations:
 * It could be developed as a web api, but assuming we are going to have
 * really large input csv file, therefore, its better to do it in a separate process.
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import { createReadStream, createWriteStream } from 'node:fs';
import process from 'node:process';
import path from 'node:path';
import { createInterface as rlCreateInterface } from 'node:readline';
import util from 'node:util';

import csv from 'csv-parser';
import ObjectsToCsv from 'objects-to-csv';

import { connect as connectDb } from './db/database.js';
import IPInfoModel from './models/ipinfo.model.js';

import { ipToInt } from './lib/util.js';

// get data source file path from user
const rl = rlCreateInterface({ input: process.stdin, output: process.stdout });
const questionAsync = util.promisify(rl.question).bind(rl);
const defaultSource = '../ip_lookup_sample.csv';
const sourcePath = await questionAsync(`Enter CSV file path as data source? (${defaultSource}) `) || defaultSource;
rl.close();

// connect to database
await connectDb(process.env.IPLKUP_MONGO_DB_URL);
console.log('Connected to database store.');

// streams to read from source file, and write failed batches to separate file
const failures = {
  path: path.join(path.dirname(sourcePath), `failed_batch_${new Date().getTime()}.csv`),
  count: 0
};
const writer = createWriteStream(failures.path);
const reader = createReadStream(sourcePath).pipe(csv());

const reportErrors = () => {
  if (failures.count) {
    console.error(`Failed to import ${failures.count} entries, saved in the ${failures.path}.`);
  }
};

// clean up before exiting
['SIGINT', 'SIGTERM', 'uncaughtException'].forEach((signal) => {
  process.on(signal, (err) => {
    console.error('Exiting...', err);
    reportErrors();
    database?.close();
    writer?.close();
    process.exit();
  });
});

/**
 * Right now it only supports data insertion, but it can be modified to
 * support upsert operation - to update data in bulk.
 */
const saveBatch = async (entries) => {
  try {
    const modified = entries.map((e) => ({
      ...e,
      start_ip_int: ipToInt(e.start_ip),
      end_ip_int: ipToInt(e.end_ip),
      join_key_int: ipToInt(e.join_key),
    }));
    await IPInfoModel.insertMany(modified);
  } catch (err) {
    console.error(err);
    failures.count += entries.length;
    const failedEntries = await (new ObjectsToCsv(entries)).toString();
    writer.write(failedEntries);
  }
};

let entries = [];
const processData = (data) => {
  entries.push(data);
  if (entries.length === 20000) {
    setImmediate(async () => {
      await saveBatch(entries);
      entries = [];
    });
  }
};

const completed = async () => {
  console.log('Finished reading data from file.');
  // save remaining records
  if (entries.length > 0) {
    await saveBatch(entries);
  }
  entries = [];
  reportErrors();
  process.exit();
};

const readerError = () => {
  console.error('Something went wrong while trying to import data from file.', err);
};

console.log(`Importing data from ${sourcePath}`);
reader.on('data', processData);
reader.on('end', completed);
reader.on('error', readerError);
