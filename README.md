# IP-Lookup API 🚀
A simple ip address lookup API, with high performance in mind. It uses pre-collected data, and calculates hostname on the fly.

## Wiki
It requires Node.js v16, MongoDB v6, and Redis v6 or higher.
1. Run `npm install`
2. Refer to .env to grab all the required environment variables
3. It requires two instances of redis server, one for stats, and other for caching
4. `node src/loader.js` allows you to seed data from your own csv file, if no file name is provded it will seed from the attached sample file available on root
5. `npm start` to launch API

## DEMO
Enter a testing IPv4 address in the <IPv-HERE> placeholder to get information.
```
curl --location --request GET 'http://localhost:3001/api/lookup/<IPv4-HERE>'
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

Get useage stats with the following endpoint
```
curl --location --request GET 'http://localhost:3001/api/stats'
```
The above request gets a response like
```
{
    "usage": 21330
}
```