#!/usr/bin/env python
import pika
import uuid
# import json


class AuthorizationClient(object):
    def __init__(self):
        print 'Creating authorization client'
        credentials = pika.PlainCredentials('new_user', 'password')
        parameters = pika.ConnectionParameters('149.165.169.11',
                                               5672,
                                               '/',
                                               credentials)
        self.connection = pika.BlockingConnection(parameters)
        # self.connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))

        self.channel = self.connection.channel()

        result = self.channel.queue_declare(exclusive=True)
        self.callback_queue = result.method.queue

        self.channel.basic_consume(self.on_response, no_ack=True,
                                   queue=self.callback_queue)

    def on_response(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            self.response = body

    def call(self, n):
        self.response = None
        self.corr_id = str(uuid.uuid4())
        self.channel.basic_publish(exchange='',
                                   routing_key='authorization_queue',
                                   properties=pika.BasicProperties(
                                     reply_to=self.callback_queue,
                                     correlation_id=self.corr_id,
                                   ),
                                   body=str(n))
        while self.response is None:
            self.connection.process_data_events()
        return self.response


authorization_client = AuthorizationClient()

# print(" [x] Requesting fib(2)")
# message = {"id": 1, "resource": 1}
# response = authorization_client.call(json.dumps(message))
# print(" [.] Got %r" % response)
