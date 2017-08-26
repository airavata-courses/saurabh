# Database for authentication
CREATE USER `authentication_user`@`localhost` IDENTIFIED BY 'password';

CREATE DATABASE IF NOT EXISTS `authentication-db`;

GRANT ALL PRIVILEGES ON `authentication-db` TO `authentication_user`@`localhost`;

USE `authentication-db`;

CREATE TABLE IF NOT EXISTS `authentications` (
  user_id int(10) auto_increment,
  user_pwd varchar(10),
  primary key (user_id)
);

GRANT ALL PRIVILEGES ON `authentications` TO `authentication_user`@`localhost`;

DROP TABLE `authentications`;

INSERT INTO `authentications` (user_pwd)
VALUES ('password1');

INSERT INTO `authentications` (user_pwd)
VALUES ('password2');