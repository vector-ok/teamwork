const pool = require('../services/config');

const feedGet = (req, res) => {
  pool.connect((err, client, done) => {
    const query = 'SELECT * FROM articles ORDER BY dateCreated';
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({ error });
      }
      if (result.rows < '1') {
        res.status(404).send({
          status: 'Failed',
          message: 'No article found',
        });
      } else {
        res.status(200).send({
          status: 'Successful',
          articles: result.rows,
        });
      }
    });
  });
};

module.exports = { feedGet };
