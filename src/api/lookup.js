import { CustomError } from '../lib/error.js';
import { lookupIPv4 } from '../lib/looker.js';
import { validateIPv4 } from '../lib/validation.js';

export const handleIPv4Lookup = async (ip) => {
    await validateIPv4(ip);
    const info = await lookupIPv4(ip);
    if (!info) {
        throw new CustomError({
            statusCode: 404,
            message: 'No information is available for this IP address'
        });
    }
    return info;
};
