const express = require('express');

const app = express();

const { Pool } = require('pg');

const bcrypt = require('bcrypt');

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

// POST /auth
app.post('/auth/create-user', (req, res) => {
  bcrypt.hash(req.body.password, 10).then(
    (hash) => {
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        gender: req.body.gender,
        jobRole: req.body.jobRole,
        department: req.body.department,
        address: req.body.address,
        userId: req.body.userId,
      };

      pool.connect((err, client, done) => {
        const query = 'INSERT INTO employees(firstName, lastName, email, password, gender, imageUrl, jobRole, department, address, userId) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *';
        const values = [user.firstName, user.lastName,
          user.email, user.password, user.gender,
          user.imageUrl, user.jobRole, user.department, user.address, user.userId];

        client.query(query, values, (error) => {
          done();
          if (error) {
            throw error;
          } else {
            res.status(201).json({
              status: 'success',
              message: 'User account successfully created',
              info: user,
            });
          }
        });
      });
    },
  );
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
