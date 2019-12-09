const express = require('express');

const ctrl = require('../controllers/userController');

const router = express.Router();

router.post('/create-user', ctrl.signupPost);

router.post('/signin', ctrl.signinPost);

module.exports = router;
