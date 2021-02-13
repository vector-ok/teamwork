const express = require('express');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());

const userRoute = require('./routes/userRoutes');

const gifRoute = require('./routes/gifRoutes');

const articleRoute = require('./routes/articleRoutes');

const feedRoute = require('./routes/feedRoutes');

// const pool = new Pool({
//
//   user: 'admin', // this is the db user
//   host: 'localhost',
//   database: 'teamwork_db',
//   password: 'admin',
//   port: 5432,
//   max: 10, // max number of clients in the pool
//   idleTimeoutMillis: 30000,
// });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// POST /auth
app.use('/auth', userRoute);

// POST /gifs
app.use('/gifs', gifRoute);

// articles
app.use('/articles', articleRoute);

// GET /feed Employees can view all articles or gifs
app.use('/feed', feedRoute);

app.use('/', (req, res, next) => {
  res.json({
    message: 'App served successfully. This is the default response! Check your endpoint if you did not expect this',
  });
  next();
});
module.exports = app;
