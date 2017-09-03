# Authentication service
## Description
This service takes user id, password and resource id as input. This service stores the user ids and passwords in a MySQL database. It queries the database to authenticate the user. If the user is **legit**, it calls Authorization service for checking authorization of the user to access the resource. Otherwise, it returns a [401](https://httpstatuses.com/401).
This service is written in Python and exposes REST endpoints using [Flask](http://flask.pocoo.org/).

## Set up
1) [Install Python 2.7.2](https://www.python.org/download/releases/2.7.2/) if it is not already installed
1) Check whether Python was successfully installed by executing the command `python --version`
1) [Install Flask](http://flask.pocoo.org/docs/0.12/installation/) package. This is used to expose REST endpoints
1) [Install Python MySQL connector](https://dev.mysql.com/downloads/connector/python/) package
1) [Install Requests](http://docs.python-requests.org/en/master/user/install/#install) package
1) Execute `python authentication_service.py` from command line to start the server