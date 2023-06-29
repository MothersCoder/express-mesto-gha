const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const isEmail = require('validator/lib/isEmail');
// eslint-disable-next-line import/no-extraneous-dependencies
const isLength = require('validator/lib/isLength');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    validate: {
      validator: (name) => isLength(name, { min: 2, max: 30 }),
      message: 'Длинна имени должна быть от 2 до 30 символов.',
    },
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    validate: {
      validator: (about) => isLength(about, { min: 2, max: 30 }),
      message: 'Информация о вас очен интересна, но постарайтесь уложиться в описание от 2 до 30 символов.',
    },
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
