# EBankSphere

## Overview

EBankSphere is a full-stack digital banking management system designed to simulate real-world banking operations. The application combines a modern web interface with a robust backend and a C++ banking engine to provide secure account management, fund transfers, transaction monitoring, and appointment scheduling.

The system uses SQLite for persistent data storage and follows a client-server architecture where the frontend communicates with a Node.js server that interacts with the banking core.

---

## Features

### User Authentication

* Secure user login
* Account status verification
* Frozen account restrictions
* PIN-based transaction authorization

### Account Management

* View account information
* Check account balance
* Account status monitoring
* Unique account number allocation

### Money Transfer System

* Transfer funds between accounts
* PIN verification before transfer
* Balance validation
* Automatic transaction recording

### Transaction Management

* Complete transaction history
* Transfer records
* Date-based transaction tracking
* Transaction status monitoring

### Appointment Scheduling

* Book bank appointments
* Purpose-based appointment requests
* Automated time slot allocation
* Appointment history tracking

### Administrative Dashboard

* View all users
* View all transactions
* Freeze/Unfreeze accounts
* Monitor banking activities

---

## Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Banking Engine

* C++

### Database

* SQLite3

---

## System Architecture

```text
Frontend (HTML/CSS/JS)
        │
        ▼
Node.js + Express Server
        │
        ▼
C++ Banking Engine (bank.cpp)
        │
        ▼
SQLite Database (bank.db)
```

---

## Database Design

### Users Table

| Field    | Description     |
| -------- | --------------- |
| username | Unique username |
| password | User password   |
| account  | Account number  |
| balance  | Current balance |
| status   | ACTIVE/FROZEN   |
| pin      | Transaction PIN |

### Transactions Table

| Field    | Description        |
| -------- | ------------------ |
| id       | Transaction ID     |
| username | User               |
| type     | Transaction type   |
| sender   | Sender account     |
| receiver | Receiver account   |
| amount   | Transaction amount |
| date     | Transaction date   |
| status   | Transaction status |

### Appointments Table

| Field    | Description         |
| -------- | ------------------- |
| id       | Appointment ID      |
| username | User                |
| date     | Appointment date    |
| time     | Appointment time    |
| purpose  | Appointment purpose |

---

## Core Functionalities

### Login System

* User authentication
* Admin authentication
* Account status verification

### Fund Transfer

* Receiver account validation
* PIN verification
* Balance checking
* Transaction logging

### Appointment Booking

* Date selection
* Purpose specification
* Automatic slot generation

### Admin Controls

* View customers
* Monitor transactions
* Freeze accounts
* Activate accounts

---

## Sample Users

| Username | Password | PIN  |
| -------- | -------- | ---- |
| user1    | 1234     | 1234 |
| user2    | 1234     | 1234 |
| user3    | 1234     | 1234 |

### Admin

Username: admin

Password: admin123

---

## Installation

### Clone Repository

git clone https://github.com/yourusername/ebanksphere.git

cd ebanksphere

### Install Dependencies

npm install

### Run Server

node server.js

### Open Application

Open index.html or visit the configured local server URL.

---

## Security Features

* PIN-protected transfers
* Account freeze functionality
* Authentication validation
* Transaction auditing
* Persistent database storage

---

## Future Enhancements

* JWT Authentication
* Password Encryption
* Online Loan Management
* Fixed Deposit Module
* Credit Card Services
* Email Notifications
* OTP Verification
* AI Fraud Detection
* Mobile Banking Application

---

## Contributors

* Sarthak Negi
* Team EBankSphere

---

## License

This project was developed for educational and academic purposes.
