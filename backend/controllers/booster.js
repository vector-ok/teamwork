const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const booster = {
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  },

  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },

  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },

  generateToken(id) {
    const token = jwt.sign({
      userId: id,
    },
    process.env.SECRET, { expiresIn: '1d' });

    return token;
  },
};

module.export = booster;

// app.post('/auth/signin', async (req, res) => {
//   if (!req.body.email || !req.body.password) {
//     return res.status(400).send({ message: 'Some values are missing' });
//   }
//   if (!booster.isValidEmail(req.body.email)) {
//     return res.status(400).send({ message: 'Please enter a valid email address' });
//   }
//   const text = 'SELECT * FROM users WHERE email = $1';
//   try {
//     const { rows } = await pool.query(text, [req.body.email]);
//     if (!rows[0]) {
//       return res.status(400).send({ message: 'The credentials you provided is incorrect' });
//     }
//     if (!booster.comparePassword(rows[0].password, req.body.password)) {
//       return res.status(400).send({ message: 'The credentials you provided is incorrect' });
//     }
//     const token = booster.generateToken(rows[0].id);
//     return res.status(200).send({ token });
//   } catch (error) {
//     return res.status(400).send(error);
//   }
// });
