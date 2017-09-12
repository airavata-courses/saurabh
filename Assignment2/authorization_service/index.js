#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'authorization_user',
  password : 'password',
  database : 'authorization-db',
  port     : 3306
});
connection.connect();

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'authorization_queue';

    ch.assertQueue(q, {durable: false});
    ch.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    ch.consume(q, function reply(msg) {
      var reqStr = msg.content.toString()
      var requestObj = JSON.parse(reqStr)
      var userId = requestObj.id
      var resourceId = requestObj.resource
      isUserAuthorized(userId, resourceId, function (isAuthorized) {
        responseObj = {}
        responseObj.isAuthorized = isAuthorized
        if (isAuthorized) {
          sendMessage(function(resourceString) {
            responseObj.responseCode = 200
            responseObj.resource = resourceString
            var response = JSON.stringify(responseObj)
            ch.sendToQueue(msg.properties.replyTo,
              new Buffer(response.toString()),
              {correlationId: msg.properties.correlationId});
            ch.ack(msg);
          })
        } else {
          responseObj.responseCode = 401
          var response = JSON.stringify(responseObj)
          ch.sendToQueue(msg.properties.replyTo,
            new Buffer(response.toString()),
            {correlationId: msg.properties.correlationId});
          ch.ack(msg);
        }
      });
    });
  });
});

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

function sendMessage(next) {
  amqp.connect('amqp://localhost', function(err1, conn1) {
    conn1.createChannel(function(err1, ch1) {
      ch1.assertQueue('', {exclusive: true}, function(err1, q) {
        var corr = Math.random().toString() +
                   Math.random().toString() +
                   Math.random().toString()
        var num = 1
  
        console.log(' [x] Requesting secret(%d)', num)
  
        ch1.consume(q.queue, function(msg) {
          if (msg.properties.correlationId === corr) {
            console.log(' [.] Got %s', msg.content.toString());
            setTimeout(function() { conn1.close(); process.exit(0) }, 500);
            next(msg.content.toString())
          }
        }, {noAck: true});
  
        ch1.sendToQueue('resource_queue',
          new Buffer(num.toString()),
          { correlationId: corr, replyTo: q.queue });
      });
    });
  });
}