CREATE DATABASE ebanksphere;

USE ebanksphere;

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
email VARCHAR(100),
password VARCHAR(100),
age INT,
credit_score INT
);

CREATE TABLE transactions (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
amount DOUBLE,
category VARCHAR(50),
date DATE
);

CREATE TABLE loans (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
amount DOUBLE,
status VARCHAR(20)
);

CREATE TABLE appointments (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
date DATE,
time TIME
);

INSERT INTO users (name,email,password,age,credit_score)
VALUES
('Rahul','rahul@gmail.com','1234',25,700),
('Amit','amit@gmail.com','1234',65,850),
('Neha','neha@gmail.com','1234',30,600);