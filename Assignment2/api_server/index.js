var amqp = require('amqplib/callback_api');

const express = require('express');
const app = express();
const request = require('request')
const Promise = require('promise')
const fs = require('fs')

function getIPv4() {
  return new Promise(function(fulfill, reject) {
    request('https://ipv4.icanhazip.com/', function (error, response, body) {
      if (error) {
        reject(error)
      } else {
        fulfill(body)
      }
    });
  })
}

function editHTML() {
  getIPv4().done(function(ipv4) {
    ipv4 = ipv4.replace(/\n$/, '')
    console.log('Got IPv4 -> ' + ipv4)
    fs.readFile('index.html', function(err, data) {
      if (err) {
        return console.error(err);
      }
      var oldString = 'var ip = ""'
      var newString = 'var ip = "' + ipv4 + '"'
      data = data.toString()
      data = data.replace(oldString, newString)
      fs.writeFileSync('index.html', data, 'utf-8')
    })
  })
}

editHTML()

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