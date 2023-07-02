// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUsers, getUserById, changeUserData, changeUserAvatar, getUserData,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserData);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^https?:\/\/(www\.)?[a-zA-Z0-9-]*\.[a-zA-Z0-9]*\b([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)#?/),
    email: Joi.string().email(),
  }).unknown(true),
}), changeUserData);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().regex(/^https?:\/\/(www\.)?[a-zA-Z0-9-]*\.[a-zA-Z0-9]*\b([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)#?/),
  }).unknown(true),
}), changeUserAvatar);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().min(24),
  }).unknown(true),
}), getUserById);

module.exports = router;
