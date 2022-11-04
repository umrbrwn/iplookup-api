import { createClient } from 'redis';

/** Creates redis client and connects to it on given url */
export const connect = async (url) => {
  const client = createClient({ url });
  client.on('error', (error) => global.log.error('Redis Client Error', error));
  await client.connect();
  return client;
};
