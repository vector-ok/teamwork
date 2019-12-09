const { Pool } = require('pg');

const pool = new Pool({

  user: 'admin', // this is the db user
  host: 'localhost',
  database: 'teamwork_db',
  password: 'admin',
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
});

module.exports = pool;
