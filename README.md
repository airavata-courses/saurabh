# Secret Resource Manager
## Description
This application provides access to secret resources. It uses the [microservice architecture](http://microservices.io/patterns/microservices.html).
1) The application authenticates a user by checking their username and password.
1) Then it checks whether the user is authorized to access the secret resource.
1) After a user is found to be authentic and authorized to access the resource, the application returns the resource string

We use three microservices in this application:
  - authentication service
  - authorization service
  - resource service  
![alt text](https://github.com/saurabhagrawal0412/Assignment1/blob/master/design.jpg)

### [Authentication service](https://github.com/saurabhagrawal0412/Assignment1/tree/master/authentication-service)
This service takes user id, password and resource id as input. This service stores the user ids and passwords in a MySQL database. It queries the database to authenticate the user. If the user is **legit**, it calls Authorization service for checking authorization of the user to access the resource. Otherwise, it returns a [401](https://httpstatuses.com/401).
This service is written in Python and exposes REST endpoints using [Flask](http://flask.pocoo.org/).

### [Authorization service](https://github.com/saurabhagrawal0412/Assignment1/tree/master/authorization-service)
This service takes user id and resource id as input. This service stores the authorizations of users in a MySQL database. It queries the database to check whether a user is authorized to access a specific resource. If the user is **authorized**, it calls Resource service to get the secret resource string. Otherwise, it returns a [401](https://httpstatuses.com/401).
This service is written in Javascript and uses [Express JS](https://expressjs.com/) to expose REST endpoints.

### [Resource service](https://github.com/saurabhagrawal0412/Assignment1/tree/master/resource-service)
This service takes resource id as input. This service stores the resource ids and the secret resource strings in a MySQL database. It queries the database to retrieve the resource string with respect to a resource id. If the resource id is **valid**, it returns the secret resource string. Otherwise, it returns a [400](https://httpstatuses.com/400).
This service is written in Java and uses [Spring Boot](https://projects.spring.io/spring-boot/) to expose the REST endpoints.

## Set up
### Database set up
1) [Install MySQL Workbench](https://dev.mysql.com/doc/workbench/en/wb-installing.html) for your operating system
1) Run the [database scripts](https://github.com/saurabhagrawal0412/Assignment1/tree/master/db_scripts) on MySQL workbench by going to `File -> Run SQL Script`
1) Clone the [repository](https://github.com/saurabhagrawal0412/Assignment1.git)
1) Follow the steps in individual README
1) `cd` to **UI** directory and run the webpage **index.html**

## Database
1) **User 1**:
  > ID: 1, <br/>
  > Password: password1, <br/>
  > Authorized resources: 1 and 2

2) **User 2**:
  > ID: 2, <br/>
  > Password: password2, <br/>
  > Authorized resources: 2

## How to test this application
1) **Test case 1**: Correct credentials and authorized resources
  > ID -> 1 <br/> <br/>
  > Password -> password1 <br/>
  > Resource ID -> 1 <br/>
  > Expected output -> resource 1: secret 1

2) **Test case 2**: Incorrect credentials
  > ID -> 1 <br/>
  > Password -> wrongpassword <br/>
  > Resouce ID -> 1 <br/>
  > Expected output -> You are not authentic user

3) **Test case 3**: Trying to access unauthorized resource
  > ID -> 2 <br/>
  > Password -> password2 <br/>
  > Resouce ID -> 2 <br/>
  > Expected output -> Unauthorized for accessing resource
