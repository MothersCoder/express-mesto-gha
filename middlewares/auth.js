// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const { tokenKey } = require('../controllers/token-key');
const Unautorized = require('../errors/unauthorized-err');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new Unautorized('Пожалуйста, авторизуйтесь');
  }

  let payload;

  try {
    payload = jwt.verify(token, tokenKey);
  } catch (err) {
    throw new Unautorized('Пожалуйста, авторизуйтесь');
  }

  req.user = payload;

  next();
};

module.exports = {
  auth,
};
