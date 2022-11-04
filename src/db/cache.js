import NodeCache from 'node-cache';

/** Fast cache on server memory to reduce latency */
export class Cache {
    constructor(ttl) {
        this.context = new NodeCache({ stdTTL: ttl });
    }

    get = (key) => this.context.get(key);

    set = (key, value) => this.context.set(key, value);
}
