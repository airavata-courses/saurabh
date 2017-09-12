#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

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
          setTimeout(function() { conn.close(); process.exit(0) }, 500);
        }
      }, {noAck: true});

      ch.sendToQueue('resource_queue',
        new Buffer(num.toString()),
        { correlationId: corr, replyTo: q.queue });
    });
  });
});