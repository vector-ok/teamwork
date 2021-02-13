const express = require('express');

const ctrl = require('../controllers/gifController');

const router = express.Router();

// const { Pool } = require('pg');
//
// const pool = new Pool({
//   user: 'admin', // this is the db user
//   host: 'localhost',
//   database: 'teamwork_db',
//   password: 'admin',
//   port: 5432,
//   max: 10, // max number of clients in the pool
//   idleTimeoutMillis: 30000,
// });

router.post('/', ctrl.gifPost);

router.delete('/:id', ctrl.gifDelete);

router.post('/:id/comment', ctrl.commentPost);

module.exports = router;
