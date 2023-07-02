const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const isLength = require('validator/lib/isLength');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    validate: {
      validator: (name) => isLength(name, { min: 2, max: 30 }),
      message: 'Длинна имени должна быть от 2 до 30 символов.',
    },
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    validate: {
      validator: (about) => isLength(about, { min: 2, max: 30 }),
      message: 'Информация о вас очен интересна, но постарайтесь уложиться в описание от 2 до 30 символов.',
    },
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (link) => /^https?:\/\/(www\.)?[a-zA-Z0-9-]*\.[a-zA-Z0-9]*\b([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)#?/.test(link),
      message: 'Неправильный формат ссылки на аватар',
    },
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
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userSchema);
