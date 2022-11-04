# IP-Lookup API 🚀
A simple ip address lookup API, with high performance in mind. It uses pre-collected data, and calculates hostname on the fly.

## Wiki
It requires Node.js v16, MongoDB v6, and Redis v6 or higher.
1. Run `npm install`
2. Refer to .env to grab all the required environment variables
3. It requires two instances of redis server, one for stats, and other for caching
4. `node loader.js` allows you to seed data from your own csv file, if no file name is provded it will seed from the attached sample file available on root
5. `npm start` to launch API

## DEMO
Enter a testing IPv4 address in the <IPv-HERE> placeholder to get information.
```
curl --location --request GET 'http://localhost:3000/api/lookup/<IPv4-HERE>'
```
Get useage stats with the following endpoint
```
curl --location --request GET 'http://localhost:3000/api/stats'
```