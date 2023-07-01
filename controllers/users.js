// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const { tokenKey } = require('./token-key');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const Conflict = require('../errors/conflict-err');
const Forbidden = require('../errors/forbidden-err');
const Unautorized = require('../errors/unauthorized-err');

const getUserInfo = (id, res, next) => {
  User.findById(id, 'name about avatar email')
    .orFail(() => new NotFoundError('Пользователя с таким ID не существует.'))
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

const getUserData = (req, res, next) => {
  getUserInfo(req.user._id, res, next);
};

const getUserById = (req, res, next) => {
  getUserInfo(req.params.id, res, next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Conflict('Пользователь с таким e-mail уже зарегистрирован');
      }
      return bcrypt.hash(req.body.password, 10);
    })
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

const changeUserData = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден, указан неверный ID'))
    .then((newUserData) => res.status(200).send({ data: newUserData }))
    .catch(next);
};

const changeUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь с таким ID не найден'))
    .then((newUserData) => res.status(200).send({ data: newUserData }))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(() => new Unautorized('Неверный логин или пароль'))
    .then((user) => {
      bcrypt.compare(password, user.password, (err, isPasswordMatch) => {
        if (!isPasswordMatch) {
          throw new Forbidden('Неверный логин или пароль');
        }
        const token = jwt.sign({ _id: user._id }, tokenKey, { expiresIn: '7d' });
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        });
        return (
          res.status(200).send({ token })
        );
      });
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUserById,
  getUserData,
  getUsers,
  changeUserData,
  changeUserAvatar,
  login,
};
