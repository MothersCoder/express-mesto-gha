const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    require: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Веденный адрес не соответстует стандарной записи почты - exp@server.com',
    },

  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  token: {
    type: String,
  },
});

module.exports = mongoose.model('user', userSchema);
