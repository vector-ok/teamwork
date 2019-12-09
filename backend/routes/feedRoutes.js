const express = require('express');

const router = express.Router();

const ctrl = require('../controllers/feedController');

router.get('/', ctrl.feedGet);

module.exports = router;
