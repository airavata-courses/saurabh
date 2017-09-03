# Resource service
## Description
This service takes resource id as input. This service stores the resource ids and the secret resource strings in a MySQL database. It queries the database to retrieve the resource string with respect to a resource id. If the resource id is **valid**, it returns the secret resource string. Otherwise, it returns a [400](https://httpstatuses.com/400).
This service is written in Java and uses [Spring Boot](https://projects.spring.io/spring-boot/) to expose the REST endpoints.

## Set up
1) [Install Java Development Kit (JDK 8)](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) if it not already installed
1) Check whether Java is succesfully installed or not by running `java -version`
1) `cd` to the **target** directory
1) Execute the command `java -jar resource-service-0.0.1-SNAPSHOT.jar` from command line