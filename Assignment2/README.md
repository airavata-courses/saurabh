# Secret Resource Manager
## Description
This application provides access to secret resources. It uses the [microservice architecture](http://microservices.io/patterns/microservices.html).
1) The application authenticates a user by checking their username and password.
1) Then it checks whether the user is authorized to access the secret resource.
1) After a user is found to be authentic and authorized to access the resource, the application returns the resource string

We use four microservices in this application:
  - API server
  - authentication service
  - authorization service
  - resource service  
![alt text](https://github.com/airavata-courses/saurabh/blob/master/Assignment2/design.jpg)

### [API server](https://github.com/airavata-courses/saurabh/tree/master/Assignment1/api_server)
This service serves webpages and maps user requests to the services.
This helps separate business logic from webpage serving and request handling code.
API server makes a Rabbit MQ RPC request to the authentication service.

### [Authentication service](https://github.com/airavata-courses/saurabh/tree/master/Assignment1/authentication-service)
This service takes user id, password and resource id as input. This service stores the user ids and passwords in a MySQL database. It queries the database to authenticate the user. If the user is **legit**, it makes a RPC call to Authorization service for checking authorization of the user to access the resource. Otherwise, it returns a error in the RPC response.
This service is written in Python and uses [pika](https://pika.readthedocs.io/en/0.10.0/) to implement both RabbitMQ RPC server and a client.

### [Authorization service](https://github.com/airavata-courses/saurabh/tree/master/Assignment1/authorization-service)
This service takes user id and resource id as input. This service stores the authorizations of users in a MySQL database. It queries the database to check whether a user is authorized to access a specific resource. If the user is **authorized**, it makes an RPC request to Resource service to get the secret resource string. Otherwise, it returns an error in the RPC response.
This service is written in Javascript and uses [amqplib](https://www.npmjs.com/package/amqplib) to implement both RabbitMQ RPC server and a client.

### [Resource service](https://github.com/airavata-courses/saurabh/tree/master/Assignment1/resource-service)
This service takes resource id as input. This service stores the resource ids and the secret resource strings in a MySQL database. It queries the database to retrieve the resource string with respect to a resource id. If the resource id is **valid**, it returns the secret resource string in the RPC response. Otherwise, it returns an error in the RPC response.
This service is written in Java and uses [com.rabbitmq](https://www.rabbitmq.com/java-client.html) to implement the RabbitMQ RPC client.

## Current status
* Creating the instances **Done**
* Changing the services to handle RabbitMQ RPC requests instead of the HTTP ones **Done**
* Installation of Jenkins **Done**
* Configuring Jenkins to pull from Github repository **Remaining**
* Dockerizing services **Remaining**