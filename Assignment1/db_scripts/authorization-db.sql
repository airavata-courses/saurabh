# Database for authorization
CREATE USER IF NOT EXISTS `authorization_user`@`localhost` IDENTIFIED BY 'password';

DROP DATABASE IF EXISTS `authorization-db`;

CREATE DATABASE IF NOT EXISTS `authorization-db`;

USE `authorization-db`;

GRANT ALL PRIVILEGES ON `authorization-db` TO `authorization_user`@`localhost`;

CREATE TABLE IF NOT EXISTS `authorizations` (
  user_id varchar(10), 
  resource_id varchar(10),
  primary key (user_id, resource_id)
);

GRANT ALL PRIVILEGES ON `authorizations` TO `authorization_user`@`localhost`;

INSERT INTO `authorizations` (user_id, resource_id)
VALUES ('1', '1');

INSERT INTO `authorizations` (user_id, resource_id)
VALUES ('1', '2');

INSERT INTO `authorizations` (user_id, resource_id)
VALUES ('2', '1');
