const express = require('express');

const app = express();

const { Pool } = require('pg');

const pool = new Pool({

  user: 'admin', // this is the db user credential
  host: 'localhost',
  database: 'teamwork_db',
  password: 'admin',
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


// **********************  ***********

app.use('/', (req, res, next) => {
  res.json({
    message: 'app served successfully. THis is a default route response!',
  });
  next();
});

module.exports = app;
