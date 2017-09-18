#!/usr/bin/env python
import ast
import pika
# import mysql.connector
import json
from rpc_client import AuthorizationClient
from authenticate import is_authentic_user

# Connecting to the MySQL database
# cnx = mysql.connector.connect(user='authentication_user',
#                               password='password',
#                               host='localhost',
#                               database='authentication-db')
# cursor = cnx.cursor()

# Server properties of the authorization server
AUTHORIZATION_SERVER_HOST = "localhost"
AUTHORIZATION_SERVER_PORT = 3000


# def authenticate_user(user_id, password):
#     """This function performs user authentication by checking the DB table 'authentications'
#     and forwards the request to authorization service
#     :param user_id: User ID
#     :param password: User password
#     :return: True if user is authentic, false otherwise
#     """
#     global cursor, AUTHORIZATION_SERVER_HOST, AUTHORIZATION_SERVER_PORT
#     query = "SELECT COUNT(*) AS cnt FROM `authentications` WHERE user_id=%s AND user_pwd=%s;"
#     cursor.execute(query, [user_id, password])
#     count = cursor.fetchone()[0]
#     return True if count >= 1 else False

# def authenticate_user(user_id, password):
#     """This function performs user authentication by checking the DB table 'authentications'
#     and forwards the request to authorization service
#     :param user_id: User ID
#     :param password: User password
#     :return: True if user is authentic, false otherwise
#     """
#     authentication_dict = dict()
#     authentication_dict['1'] = 'password1'
#     authentication_dict['2'] = 'password2'
#     if str(user_id) in authentication_dict and authentication_dict[user_id] == password:
#         return True
#     else:
#         return False


credentials = pika.PlainCredentials('new_user', 'password')
parameters = pika.ConnectionParameters('149.165.169.11',
                                       5672,
                                       '/',
                                       credentials)
# connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
connection = pika.BlockingConnection(parameters)
channel = connection.channel()
channel.queue_declare(queue='authentication_queue')


def on_request(ch, method, props, body):
    curr_message = str(body)
    req_dict = ast.literal_eval(curr_message)
    print 'req_dict ->', req_dict
    user_id = req_dict['userId']
    password = req_dict['password']
    resource_id = req_dict['resourceId']

    if is_authentic_user(user_id, password):
        authorization_client = AuthorizationClient()
        message = {"id": user_id, "resource": resource_id}
        response = authorization_client.call(json.dumps(message))
    else:
        response = 'Unauthentic user'

    ch.basic_publish(exchange='',
                     routing_key=props.reply_to,
                     properties=pika.BasicProperties(correlation_id=props.correlation_id),
                     body=str(response))
    ch.basic_ack(delivery_tag=method.delivery_tag)


channel.basic_qos(prefetch_count=1)
channel.basic_consume(on_request, queue='authentication_queue')

print(" [x] Awaiting RPC requests")
channel.start_consuming()