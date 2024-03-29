CREATE DATABASE IOT_DB;

USE IOT_DB;

CREATE TABLE payment_log(id int NOT NULL AUTO_INCREMENT PRIMARY KEY, payment_time TIMESTAMP default current_timestamp NOT NULL, balance_change INT NOT NULL, current_balance INT NOT NULL);