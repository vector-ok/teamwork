const pool = require('../services/config');

// POST gif
const gifPost = (req, res) => {
  const data = {
    title: req.body.title,
    imageUrl: req.body.imageUrl,
  };

  pool.connect((err, client, done) => {
    const query = 'INSERT INTO gifs(title, imageUrl) VALUES($1,$2) RETURNING *';
    const values = [data.title, data.imageUrl];

    client.query(query, values, (error) => {
      done();
      if (error) {
        throw error;
      } else {
        res.status(201).json({
          status: 'success',
          message: 'gif added successfully',
          info: data,
        });
      }
    });
  });
  // next();
};

// DELETE gif
const gifDelete = (req, res) => {
  pool.connect((err, client, done) => {
    const query = 'DELETE FROM gifs WHERE id = $1';
    client.query(query, [req.params.id], (error) => {
      done();
      if (!err) {
        res.status(200).json({
          status: 'success',
          message: 'gif post successfully deleted',
        });
      } else {
        res.status(400).json({ error });
      }
    });
  });
};

const commentPost = (req, res) => {
  const data = {
    userId: req.body.userId,
    // articleId: req.body.articleId,
    comment: req.body.comment,
    gifId: req.body.gifId,
  };

  pool.connect((err, client, done) => {
    const query = 'INSERT INTO comments(userId, comment, gifId) VALUES($1,$2,$3) RETURNING *';
    const values = [data.userId, data.comment, data.gifId];

    client.query(query, values, (error) => {
      done();
      if (error) {
        throw error;
      }
      res.status(201).json({
        data,
      });
    });
  });
};

module.exports = { gifPost, gifDelete, commentPost };
