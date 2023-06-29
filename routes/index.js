// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const userRouters = require('./users');
const cardRouters = require('./cards');
const wrongRout = require('./error');

router.use('/users', celebrate({
  body: Joi.object.keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), userRouters);
router.use('/cards', celebrate({
  body: Joi.object.keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), cardRouters);

router.use('*', wrongRout);

module.exports = router;
