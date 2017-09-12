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
      console.log('userId -> ' + userId)
      var resourceId = requestObj.resource
      console.log('resourceId -> ' + resourceId)
      isUserAuthorized(userId, resourceId, function (isAuthorized) {
        console.log("isAuthorized -> " + isAuthorized)
        responseObj = {}
        responseObj.isAuthorized = isAuthorized
        if (isAuthorized) {

        } else {

        }
        
        var response = JSON.stringify(responseObj)
        ch.sendToQueue(msg.properties.replyTo,
          new Buffer(response.toString()),
          {correlationId: msg.properties.correlationId});
        ch.ack(msg);
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
  amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
      ch.assertQueue('', {exclusive: true}, function(err, q) {
        var corr = Math.random().toString() +
                   Math.random().toString() +
                   Math.random().toString()
        var num = 1;
  
        console.log(' [x] Requesting secret(%d)', num);
  
        ch.consume(q.queue, function(msg) {
          if (msg.properties.correlationId === corr) {
            console.log(' [.] Got %s', msg.content.toString());
            next(msg.content.toString())
            setTimeout(function() { conn.close(); process.exit(0) }, 500);
          }
        }, {noAck: true});
  
        ch.sendToQueue('resource_queue',
          new Buffer(num.toString()),
          { correlationId: corr, replyTo: q.queue });
      });
    });
  });
}