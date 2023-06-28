// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const { tokenKey } = require('../controllers/token-key');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send({ message: 'Пожалуйста, авторизуйтесь' });
  }

  let payload;

  try {
    payload = jwt.verify(token, tokenKey);
  } catch (err) {
    return res.status(401).send({ message: 'Проблемы с авторизацией. Пожалуйста, перелогиньтесь.' });
  }

  req.user = payload;

  next();
};

module.exports = {
  auth,
};
