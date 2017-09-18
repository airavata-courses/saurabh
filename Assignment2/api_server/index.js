var amqp = require('amqplib/callback_api');

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
  const userId = req.params.id
  const password = req.params.password
  const resourceId = req.params.resource

  var reqObj = { 'userId': userId, 'password': password, 'resourceId': resourceId }
  var reqStr = JSON.stringify(reqObj)

  amqp.connect('amqp://new_user:password@149.165.169.11//', function (err, conn) {
    conn.createChannel(function (err, ch) {
      ch.assertQueue('', { exclusive: true }, function (err, q) {
        var corr = Math.random().toString() +
          Math.random().toString() +
          Math.random().toString()

        console.log(' [x] Requesting secret(%s)', reqStr);

        ch.consume(q.queue, function (msg) {
          if (msg.properties.correlationId === corr) {
            var currResponse = msg.content.toString()
            console.log(' [.] Got %s', currResponse);
            res.send(currResponse)
            setTimeout(function () {
              conn.close();
              // process.exit(0)
            }, 500);
          }
        }, { noAck: true });

        ch.sendToQueue('authentication_queue',
          new Buffer(reqStr.toString()),
          { correlationId: corr, replyTo: q.queue });
      });
    });
  });
});

app.get('*', function (req, res) {
  res.status(404).send('Incorrect URL')
});

app.listen(3002, function () {
  console.log("API server started on port 3002");
});