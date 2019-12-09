// run "npm run create" to create the tables
// edit script (which table) to run in package.json

const pg = require('pg');

const config = {
  user: 'admin', // this is the db user credential
  // host: "localhost",
  database: 'teamwork_db',
  password: 'admin',
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(config);

pool.on('connect', () => {
  console.log('connected to the Database');
});

const createTablesComments = () => {
  const commentsTable = `CREATE TABLE IF NOT EXISTS
      comments(
        id SERIAL PRIMARY KEY,
        userId INT NOT NULL,
        articleId INT,
        gifId INT,
        comment VARCHAR(500) NOT NULL,
        dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;
  pool.query(commentsTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createTablesEmployees = () => {
  const employeesTable = `CREATE TABLE IF NOT EXISTS
      employees(
        userId SERIAL PRIMARY KEY,
        firstName VARCHAR(128) NOT NULL,
        lastName VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL,
        gender VARCHAR(1) NOT NULL,
        imageUrl VARCHAR(128) NULL,
        jobRole VARCHAR(128) NOT NULL,
        department VARCHAR(128) NOT NULL,
        address VARCHAR(128) NOT NULL
      )`;
  pool.query(employeesTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createTablesGifs = () => {
  const gifsTable = `CREATE TABLE IF NOT EXISTS
      gifs(
        gifId SERIAL PRIMARY KEY,
        createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        title VARCHAR(128) NOT NULL,
        imageUrl VARCHAR(128) NOT NULL
      )`;
  pool.query(gifsTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createTablesArticles = () => {
  const articlesTable = `CREATE TABLE IF NOT EXISTS
      articles(
        articleId SERIAL PRIMARY KEY,
        dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        title VARCHAR(128) NOT NULL,
        articleContent VARCHAR(500) NOT NULL
      )`;
  pool.query(articlesTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

// *********************   ***************

// pool.on('remove', () => {
//   console.log('client removed');
//   process.exit(0);
// });

// export pool and createTables to be accessible  from anywhere within the application
module.exports = {
  createTablesComments,
  createTablesGifs,
  createTablesEmployees,
  createTablesArticles,
  pool,
};

require('make-runnable');
