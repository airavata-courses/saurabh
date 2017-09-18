#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://new_user:password@149.165.169.11//', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'authorization_queue';

    ch.assertQueue(q, {durable: false});
    ch.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    ch.consume(q, function reply(msg) {
      var reqStr = msg.content.toString()
      var requestObj = JSON.parse(reqStr)
      var userId = requestObj.id.toString()
      console.log('User ID -> ' + userId)
      var resourceId = requestObj.resource.toString()
      console.log('Resource ID -> ' + resourceId)
      isUserAuthorized(userId, resourceId, function (isAuthorized) {
        responseObj = {}
        responseObj.isAuthorized = isAuthorized
        if (isAuthorized) {
          console.log("Is authorized")
          sendMessage(conn, ch, resourceId, function(resourceString) {
            console.log("After callback from sendMessage")
            responseObj.responseCode = 200
            responseObj.resource = resourceString
            var response = JSON.stringify(responseObj)
            ch.sendToQueue(msg.properties.replyTo,
              new Buffer(response.toString()),
              {correlationId: msg.properties.correlationId});
            ch.ack(msg);
          })
        } else {
          console.log("Is not authorized")
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

function isUserAuthorized(userId, resourceId, next) {
  const sqlite3 = require('sqlite3').verbose()
  
  let db = new sqlite3.Database('authorization_db.sqlite', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message)
    }
    console.log('Connected to the authorization database.')
  })

  var queryString = 'SELECT COUNT(*) AS cnt FROM authorizations WHERE user_id = ? AND resource_id = ?;'

  db.get(queryString, [userId, resourceId], (err, row) => {
    if (err) {
      console.error('Something bad happened')
    }
    if (row.cnt >= 1) {
      next(true)
    } else {
      next(false)
    }
  })
}

function sendMessage(conn, ch, resourceID, next) {
  ch.assertQueue('', {exclusive: true}, function(err1, q) {
    var corr = Math.random().toString() +
               Math.random().toString() +
               Math.random().toString()

    console.log(' [x] Requesting secret(%d)', resourceID)

    ch.consume(q.queue, function(msg) {
      if (msg.properties.correlationId === corr) {
        console.log(' [.] Got %s', msg.content.toString());
        setTimeout(function() {
           // conn.close();
           // process.exit(0) 
        }, 500);
        next(msg.content.toString())
      }
    }, {noAck: true});

    ch.sendToQueue('resource_queue',
      new Buffer(resourceID.toString()),
      { correlationId: corr, replyTo: q.queue });
  });
}