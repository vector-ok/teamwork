const pool = require('../services/config');

const articlePost = (req, res, next) => {
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
  next();
};

const articlePatch = (req, res, next) => {
  const data = {
    title: req.body.title,
    articleContent: req.body.articleContent,
  };

  pool.connect((err, client, done) => {
    const result = 'UPDATE articles SET title=$1, articleContent=$2 WHERE articleId=$3 RETURNING *';
    const values = [data.title, data.articleContent, req.params.articleId];

    client.query(result, values, (error) => {
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
  next();
};

const articleDelete = (req, res, next) => {
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
  next();
};

const articleGet = (async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM articles WHERE articleId=$1', [
      req.params.articleId,
    ]);

    if (result.rows < '1') {
      return res.status(400).send('article not found!');
    }
    res.json({
      message: 'Article retrieved',
      result,
    });
  } catch (err) {
    return res.json({
      message: 'something went wrong',
      err,
    });
  }
  return next();
});

const commentPost = (req, res) => {
  const data = {
    userId: req.body.userId,
    articleId: req.body.articleId,
    comment: req.body.comment,
  };

  pool.connect((err, client, done) => {
    const query = 'INSERT INTO comments(userId, articleId, comment) VALUES($1,$2,$3) RETURNING *';
    const values = [data.userId, data.articleId, data.comment];

    client.query(query, values, (error) => {
      done();
      if (error) {
        throw error;
      } else {
        return res.status(201).json({
          status: 'success',
          message: 'comment added successfully',
          info: data,
        });
      }
    });
  });
};

module.exports = {
  articlePost,
  articlePatch,
  articleDelete,
  articleGet,
  commentPost,
};
