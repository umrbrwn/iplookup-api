import { getUsage } from '../lib/usage.js';

export const getStats = async () => ({
    usage: +(await getUsage())
});
