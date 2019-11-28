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


// **********************  ***********

app.use('/', (req, res, next) => {
  res.json({
    message: 'app served successfully. THis is a default route response!',
  });
  next();
});

module.exports = app;
