/**
 * Considerations:
 * 1. Using cache-aside for refine control. [shorturl.at/sFR37]
 * 2. Setting server-side cache to 180s, it can handle up to 1M cached entries at a time.
 *    Ideal assumption is we serve 60k unique req/min, we generate 60k keys for next 3min,
 *    then in the next 3 min we serve 3x more request, assuming 50% of them are unique,
 *    we can go up to 180k keys at a time in the server memory.
 * 3. Assuming a single key holds up to 400Byte memory, its can take up to 72MB for 180k keys.
 * 4. Keeping in-memory/redis cache longer to avoid nslookup, and db queries as much as possible.
 * 5. 1M keys in-memory/redis keys should take around 70/80MB, assuming size of key is 400Byte.
 */

import { lookupService } from 'node:dns/promises';
import { ipToInt, ipToIntTrunk } from './util.js'

import { Cache } from '../db/cache.js';
import IPInfoModel from '../models/ipinfo.model.js';

import { increase as increaseUsage } from './usage.js';

const cache = new Cache(180);

/**
 * Finds ip address info from database
 * @param {*} ipint Integer formatted ipv4 address
 * @param {*} netpart Network part of the ipv4 address in Integer format
 */
const findByIp = (ipint, netpart) => IPInfoModel.findOne({
  join_key_int: netpart,
  start_ip_int: { $lte: ipint },
  end_ip_int: { $gte: ipint }
});

export const lookupIPv4 = async (ip) => {
  increaseUsage();

  const ipint = ipToInt(ip);

  let info = cache.get(ipint);
  if (info) { return info; }

  try {
    const incache = await global.memstore.get(ip);
    if (incache) { info = JSON.parse(incache); }
  } catch (err) {
    global.log.error('Failed to read from in-memory store.', err);
  }

  if (info) {
    cache.set(ipint, info);
    return info;
  }

  const netpart = ipToIntTrunk(ip, '.', 16);
  info = (await findByIp(ipint, netpart))?.toObject();
  if (!info) { return null; }

  const { hostname } = await lookupService(ip, 80);
  const fullInfo = { ...info, hostname };
  await global.memstore.set(ip, JSON.stringify(fullInfo), { EX: 300 });
  cache.set(ipint, fullInfo);

  return fullInfo;
};
