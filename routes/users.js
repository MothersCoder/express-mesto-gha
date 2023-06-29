// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUsers, getUserById, changeUserData, changeUserAvatar, getUserData,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum(),
  }).unknown(true),
}), getUserById);

router.get('/me', getUserData);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
  }).unknown(true),
}), changeUserData);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }).unknown(true),
}), changeUserAvatar);

module.exports = router;
