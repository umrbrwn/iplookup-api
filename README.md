# IP-Lookup API 🚀
A simple IP address lookup API, with high performance in mind. It uses pre-collected data and calculates hostname on the fly.

## How to setup:
It requires Node.js v16, MongoDB v6, and Redis v6 or higher.
1. Run `npm install`
2. Grab and configure environment variable from `.env` file
3. Start mongo db
4. Start `redis-server` for data caching
5. Start `redis-server --port 6380` for stats collection
6. Run `node src/loader.js` to seed data from csv file
7. `npm start` to launch

## DEMO
Enter a testing IPv4 address in the `{ipaddress}` placeholder to get information.
```
curl --location --request GET 'http://localhost:3001/api/lookup/{ipaddress}'
```
The above request gets a response like
```
{
    "city": "Washington",
    "region": "Washington, D.C.",
    "country": "US",
    "latitude": 28.89511,
    "longitude": -70.03137,
    "postal_code": "20004",
    "timezone": "America/New_York",
    "hostname": "example.net"
}
```

Get usage stats with the following endpoint
```
curl --location --request GET 'http://localhost:3001/api/stats'
```
The above request gets a response like
```
{
    "usage": 21330
}
```

## Wiki

#### Seeding
`src/loader.js` is a utility that seeds data from user provided csv file, to the database in batches.

#### Bulk data update [Todo]
`src/loader.js` currently performs inserts only, it can be modified to perform upsert operations during seeding process so that older data can be updated. At this time a hash of start and end IP address can be calculated and indexed, later when performing upsert, existing rows can be identified using their hash, and their values can be updated, it will seamlessly update the data while the requests are being served by caching layer.

#### Caching
There are two levels of caching, first one using Redis that can be shared across multiple instances of the API, and the other caching happens within the server memory to reduce latency under high stress. Server-side cache lives about 180s, and Redis cache for about 300s, so a key invalidates in 480s, and fresh data can be pulled from the database.
