const express = require('express');

const app = express();

const { Pool } = require('pg');

const bodyParser = require('body-parser');

app.use(bodyParser.json());

const pool = new Pool({

  user: 'admin', // this is the db user
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

// POST /articles
app.post('/articles', (req, res) => {
  const data = {
    title: req.body.title,
    articleContent: req.body.articleContent,
  };

  pool.connect((err, client, done) => {
    const query = 'INSERT INTO articles(title, articleContent) VALUES($1,$2) RETURNING *';
    const values = [data.title, data.articleContent];

    client.query(query, values, (error) => {
      done();
      if (error) {
        throw error;
      } else {
        res.status(201).json({
          status: 'success',
          message: 'article created successfully',
          info: data,
        });
      }
    });
  });
});

// PATCH /articles/<articleid>
app.patch('/articles/:articleId', (req, res) => {
  const data = {
    title: req.body.title,
    articleContent: req.body.articleContent,
  };

  pool.connect((err, client, done) => {
    const query = 'UPDATE articles SET title=$1, articleContent=$2 WHERE articleId=$3 RETURNING *';
    const values = [data.title, data.articleContent, req.params.articleId];

    client.query(query, values, (error) => {
      done();
      if (error) {
        throw error;
      } else {
        res.status(201).json({
          status: 'success',
          message: 'Article successfully updated',
          info: data,
        });
      }
    });
  });
});

// DELETE article
app.delete('/articles/:articleId', (req, res) => {
  pool.connect((err, client, done) => {
    const query = 'DELETE FROM articles WHERE articleId = $1';
    client.query(query, [req.params.articleId], (error) => {
      done();
      if (!err) {
        res.status(200).json({
          status: 'success',
          message: 'Article successfully deleted',
        });
      } else {
        res.status(400).json({ error });
      }
    });
  });
});

// GET Employees can view selected article
app.get('/articles/:articleId', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM articles WHERE articleId=$1', [
      req.params.articleId,
    ]);
    return res.json({
      message: 'Article retrieved',
      result,
    });
  } catch (err) {
    return next(err);
  }
});

// **********************  ***********

app.use('/', (req, res, next) => {
  res.json({
    message: 'app served successfully. THis is a default route response!',
  });
  next();
});

module.exports = app;
