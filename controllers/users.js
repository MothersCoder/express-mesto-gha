const User = require('../models/user');

const ERROR = require('./errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({
    name, about, avatar, validateBeforeSave: true,
  })
    .then((user) => {
      res.status(201).send({ data: user });
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
  User.findById(req.params.id, 'name about avatar')
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

module.exports = {
  createUser,
  getUserById,
  getUsers,
  changeUserData,
  changeUserAvatar,
};
