const http = require('http');
// const { Pool } = require('pg');
const app = require('./app');

// const pool = new Pool({
//   user: 'admin', // this is the db user
//   host: 'localhost',
//   database: 'teamwork_db',
//   password: 'admin',
//   port: 5432,
//   max: 10, // max number of clients in the pool
//   idleTimeoutMillis: 30000,
// });

app.set('port', process.env.PORT || 5000);
const server = http.createServer(app);

server.listen(process.env.PORT || 5000);

// module.exports = { server, pool };
