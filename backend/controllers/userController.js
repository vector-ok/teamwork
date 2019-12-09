const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const pool = require('../services/config');

const signupPost = (req, res) => {
  bcrypt.hash(req.body.password, 10).then(
    (hash) => {
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        gender: req.body.gender,
        jobRole: req.body.jobRole,
        department: req.body.department,
        address: req.body.address,
        userId: req.body.userId,
      };

      pool.connect((err, client, done) => {
        const query = 'INSERT INTO employees(firstName, lastName, email, password, gender, imageUrl, jobRole, department, address, userId) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *';
        const values = [user.firstName, user.lastName,
          user.email, user.password, user.gender,
          user.imageUrl, user.jobRole, user.department, user.address, user.userId];

        client.query(query, values, (error) => {
          done();
          if (error) {
            throw error;
          } else {
            res.json({
              status: 'success',
              message: 'User account successfully created',
              info: user,
            });
          }
        });
      });
    },
  );
};

const signinPost = (async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees WHERE email = $1', [req.body.email]);

    if (result.rows <= '0') {
      return res.status(401).json({
        message: 'no user record found',
      });
    }

    bcrypt.compare(req.body.password, result.rows[0].password).then(
      (valid) => {
        if (result.rows > '0' && valid) {
          const token = jwt.sign({ userId: result.rows.userId }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
          return res.json({
            message: 'user record found',
            token,
            data: result.rows[0],
          });
        }
        return res.status(401).json({
          message: 'record not found',
        });
      },
    );
  } catch (err) {
    return console.error(err);
  }
  return true;
});

module.exports = { signupPost, signinPost };
