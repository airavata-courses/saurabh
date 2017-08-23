/**
 * Express app to perform authorization of requests
 */

const express = require('express');
const app = express();

/**
 * Connecting to MySQL
 * Reference: https://www.npmjs.com/package/mysql
 */
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'auth_user',
  password : 'password',
  database : 'auth',
  port     : 3306
});
connection.connect();

/**
 * Local function to check if the user is authorized to access a resource
 */
function isUserAuthorized(id, resource, next) {
  var queryString = "SELECT COUNT(*) AS cnt FROM `authorizations` WHERE user_id=? AND resource_id=?;";
  connection.query(queryString, [id, resource], function (error, rows, fields) {
    if (error) throw error;
    if (rows[0].cnt >= 1) {
      next(true);
    } else {
      next(false);
    }
  });
};

/**
 * Middleware function to bypass a request to check if the user 
 * is authorized to access a resource or not
 */
app.use("/id/:id/:resource", function (req, res, next) {
  var id = req.params.id;
  var resource = req.params.resource;
  isUserAuthorized(id, resource, function (isAuthorized) {
    console.log("isAuthorized -> " + isAuthorized);
    if (! isAuthorized) {
        res.status(401).send("Unauthorized for accessing resource");
    } else {
      console.log("Is authorized");
      next();
    }
  });
});

/**
 * GET endpoint for resource 1
 */
app.get('/id/:id/resource1', function (req, res) {
  console.log("Resource 1");
  res.send("Resource 1");
});

/**
 * GET endpoint for resource 2
 */
app.get('/id/:id/resource2', function (req, res) {
  console.log("Resource 2");
  res.send("Resource 2");
});

/**
 * Handling all other bad requests
 */
app.get('*', function (req, res) {
  console.log("Bad request");
  res.status(404).send("Wrong resource");
});

// Starting the server
app.listen(3000, function () {
  console.log("App started on port 3000");
});