

const express = require('express');

const app = express();

const { Pool } = require('pg');

const bodyParser = require('body-parser');

app.use(bodyParser.json());

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

// POST /gifs
app.post('/gifs', (req, res) => {
  const data = {
    title: req.body.title,
    imageUrl: req.body.imageUrl,
  };

  pool.connect((err, client, done) => {
    const query = 'INSERT INTO gifs(title, imageUrl) VALUES($1,$2) RETURNING *';
    const values = [data.title, data.imageUrl];

    client.query(query, values, (error) => {
      done();
      if (error) {
        throw error;
      } else {
        res.status(201).json({
          status: 'success',
          message: 'gif added successfully',
          info: data,
        });
      }
    });
  });
});

// DELETE /gifs
app.delete('/gifs/:id', (req, res) => {
  pool.connect((err, client, done) => {
    const query = 'DELETE FROM gifs WHERE id = $1';
    client.query(query, [req.params.id], (error) => {
      done();
      if (!err) {
        res.status(200).json({
          status: 'success',
          message: 'gif post successfully deleted',
        });
      } else {
        res.status(400).json({ error });
      }
    });
  });
});

// GET /feed Employees can view all articles or gifs
app.get('/feed', (req, res) => {
  pool.connect((err, client, done) => {
    const query = 'SELECT * FROM articles ORDER BY dateCreated';
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({ error });
      }
      if (result.rows < '1') {
        res.status(404).send({
          status: 'Failed',
          message: 'No article found',
        });
      } else {
        res.status(200).send({
          status: 'Successful',
          articles: result.rows,
        });
      }
    });
  });
});
// **********************  ***********

app.use('/', (req, res, next) => {
  res.json({
    message: 'app served successfully. THis is a default route response!',
  });
  next();
});

module.exports = app;
