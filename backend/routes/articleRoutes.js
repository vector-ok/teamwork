const express = require('express');

const ctrl = require('../controllers/articleController');

const router = express.Router();

router.post('/', ctrl.articlePost);

router.patch('/:articleId', ctrl.articlePatch);

router.delete('/:articleId', ctrl.articleDelete);

router.get('/:articleId', ctrl.articleGet);

router.post('/:articleId/comment', ctrl.commentPost);

module.exports = router;
