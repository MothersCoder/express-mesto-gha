const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const { createUser } = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri().regex(/^https?:\/\/(www\.)?[a-zA-Z0-9-]*\.[a-zA-Z0-9]*\b([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)#?/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), createUser);

module.exports = router;
