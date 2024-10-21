# DevTrack – Developer Feature Assignment System

DevTrack is a web-based task managment tool for managing and tracking tasks within software development teams.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)


## Requirements

Make sure you have the following software installed on your system:

- Node.js (version 12 or above)
- npm (Node Package Manager)
- Mysql version 5

Installer for windows is added in the root folder of project.
When installing MySql server, make sure to install with "Use Legacy Authentication Method (Retain MySQL 5.x Compatibility)"

## Installation

1. Navigate to the project directory: DevTrack and install dependencies using npm install

2. To create the database and tables, use following commands:

  -CREATE DATABASE devtrack_db;

 -CREATE TABLE user (
    username VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-CREATE TABLE tasks (
    username VARCHAR(255),
    task VARCHAR(255),
    date VARCHAR(255),
    FOREIGN KEY (username) REFERENCES user(username)
);

-Seed the table 'user' with user data
INSERT INTO user (username,email, password) VALUES ('testuser', 'testuser@devtrack.test', 'password123');

-Seed the table 'tasks' with dummy task
INSERT INTO tasks (username, password, task) VALUES ('testuser', 'password123', '2024-10-10');


## Usage

1. Start the backend server:
   cd server => npm start

2. Start the frontend server:
   cd client => npm start

2. Open a web browser and visit `http://localhost:3000` to access the application.



## Reference sites to download files

- [Node.js](https://nodejs.org/)
- [React.js](https://reactjs.org/)
- [Mysql](https://www.mysql.com/)

