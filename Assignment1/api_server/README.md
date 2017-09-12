# API server
## Description
This service serves static webpages and performs user interaction.
It abstracts the microservices from the users.
It simply takes the forwards the user requests to the [authentication service](https://github.com/airavata-courses/saurabh/tree/master/Assignment1/authentication-service), collects response and returns it to the user.
This service is written in Javascript and uses [Express JS](https://expressjs.com/) to expose REST endpoints.

## Set up
1) [Install Node JS](https://nodejs.org/en/download/)
1) Check whether Node JS is succesfully installed or not by running `node --version`
1) Check whether NPM is succesfully installed or not by running `npm --version`
1) `cd` to the **api_server** home directory
1) Run `npm install` to download all the dependencies locally
1) Run `node index.js` to start the node server