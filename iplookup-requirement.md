We would like for you to build out a simplified, mini version of the ipinfo.io API, as well as a tiny frontend that allows looking up data and shows current API usage.

# Backend

The backend should be in Nodejs.

You should create an API that serves location data in JSON form given an input single IP address.

You may use this CSV file that contains partial location data: https://github.com/ipinfo/sample-database/blob/main/IP%20Geolocation/ip_geolocation_sample.csv. This data is indexed by IP address and is the ultimate data source for serving data in an API. You may transform this CSV into any other form that serves your purpose better. Note that in your solution, you must assume that this CSV file could be 40-50GB in size.

The output fields of the API must include all the data fields (minus IP key fields) found in the CSV file, and additionally the `hostname` field which is the RDNS lookup of the IP address, which you must calculate live when receiving requests.

You should track usage and assume QPS is high; a solution must be able to handle the stresses of high request load. Also, the usage count should persist across application restarts.

Finally, please provide a written solution that explains how you would handle bulk updating of this data without having to bring the application down or pausing operations.

# Frontend

The frontend should be in Reactjs.

You should create a JSON widget similar to what we have shown on the homepage of ipinfo.io - it should be used for querying the backend and displaying the data.

There should also be a section of the frontend that displays current API usage.
