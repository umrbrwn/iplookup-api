import { handleIPv4Lookup } from './lookup.js';
import { getStats } from './stats.js';

export const registerRoutes = (app) => {

    // ip lookup endpoints
    app.get('/api/lookup/:ip', async (request, reply) => handleIPv4Lookup(request.params.ip));

    // usage stats endpoints
    app.get('/api/stats', (request, reply) => getStats());

};
