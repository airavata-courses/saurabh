# Database for authentication
CREATE USER IF NOT EXISTS `authentication_user`@`localhost` IDENTIFIED BY 'password';

DROP DATABASE IF EXISTS `authentication-db`;

CREATE DATABASE IF NOT EXISTS `authentication-db`;

USE `authentication-db`;

GRANT ALL PRIVILEGES ON `authentication-db` TO `authentication_user`@`localhost`;

CREATE TABLE IF NOT EXISTS `authentications` (
  user_id int(10) auto_increment,
  user_pwd varchar(10),
  primary key (user_id)
);

GRANT ALL PRIVILEGES ON `authentications` TO `authentication_user`@`localhost`;

INSERT INTO `authentications` (user_pwd)
VALUES ('password1');

INSERT INTO `authentications` (user_pwd)
VALUES ('password2');
