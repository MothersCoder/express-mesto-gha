// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const { tokenKey } = require('./token-key');
const User = require('../models/user');

const ERROR = require('./errors');

const getUserInfo = (id, res) => {
  User.findById(id, 'name about avatar email')
    .then((user) => {
      if (user === null) {
        return res.status(ERROR.getData.code).send({ message: `User ${ERROR.getData.message}` });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        ERROR.uploadData.message = 'Неверно введен ID пользоватея';
        return res.status(ERROR.uploadData.code).send({ message: `${ERROR.uploadData.message}` });
      }

      return res.status(ERROR.server.code).send({ message: `${ERROR.server.message}` });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash, validateBeforeSave: true,
    }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        ERROR.uploadData.message = Object.values(err.errors).map((error) => error.message).join(', ');
        return res.status(ERROR.uploadData.code).send({ message: `${ERROR.uploadData.message}` });
      }
      return res.status(ERROR.server.code).send({ message: `${ERROR.server.message}` });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => res.status(ERROR.server.code).send({ message: `${ERROR.server.message}` }));
};

const getUserById = (req, res) => {
  getUserInfo(req.params.id, res);
};

const changeUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((newUserData) => {
      if (!newUserData) {
        return res.status(ERROR.getData.code).send({ message: `User ${ERROR.getData.message}` });
      }
      return res.status(200).send({ data: newUserData });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        ERROR.uploadData.message = Object.values(err.errors).map((error) => error.message).join(', ');
        return res.status(ERROR.uploadData.code).send({ message: `${ERROR.uploadData.message}` });
      }
      return res.status(ERROR.server.code).send({ message: `${ERROR.server.message}` });
    });
};

const changeUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((newUserData) => {
      if (!newUserData) {
        return res.status(ERROR.getData.code).send({ message: `User ${ERROR.getData.message}` });
      }
      return res.status(200).send({ data: newUserData });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        ERROR.uploadData.message = Object.values(err.errors).map((error) => error.message).join(', ');
        return res.status(ERROR.uploadData.code).send({ message: `${ERROR.uploadData.message}` });
      }
      return res.status(ERROR.server.code).send({ message: `${ERROR.server.message}` });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Такового пользователя не существует'));
      }
      bcrypt.compare(password, user.password, (err, isPasswordMatch) => {
        if (!isPasswordMatch) {
          return res.status(403).send({ message: 'Неправильный логин или пароль' });
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
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const getUserData = (req, res) => {
  getUserInfo(req.user._id, res);
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
