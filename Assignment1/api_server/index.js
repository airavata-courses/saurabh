const express = require('express');
const app = express();

app.get('/secret_resource', function (req, res) {
    var path = require('path')
    res.sendFile(path.join(__dirname, 'index.html'))
});

app.get('/', function (req, res) {
    res.redirect('/secret_resource')
});

app.get('/id/:id/password/:password/resource_id/:resource', function (req, res) {
    const URL = req.url
    const AUTH_SERVER_HOST = 'localhost'
    const AUTH_SERVER_PORT = 5000
    const util = require("util")
    var queryString = util.format("http://%s:%d%s", AUTH_SERVER_HOST, AUTH_SERVER_PORT, URL)
    console.log(queryString)
    var request = require('request');
    request(queryString, function (error, response, body) {
      res.status(response.statusCode).send(body);
    });
});

app.get('*', function (req, res) {
    res.status(404).send('Incorrect URL')
});

app.listen(3002, function () {
    console.log("API server started on port 3002");
});