# Authorization service
## Description
This service takes user id and resource id as input. This service stores the authorizations of users in a MySQL database. It queries the database to check whether a user is authorized to access a specific resource. If the user is **authorized**, it calls Resource service to get the secret resource string. Otherwise, it returns a [401](https://httpstatuses.com/401).
This service is written in Javascript and uses [Express JS](https://expressjs.com/) to expose REST endpoints.

## Set up
1) [Install Node JS](https://nodejs.org/en/download/)
1) Check whether Node JS is succesfully installed or not by running `node --version`
1) [Install Node Package Manager (npm)](https://www.npmjs.com/get-npm)
1) Check whether NPM is succesfully installed or not by running `npm --version`
1) `cd` to the **authorization service** home directory
1) Run `npm install` to download all the dependencies locally
1) Run `node server.js` to start the node server