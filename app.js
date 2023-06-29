const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit');
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors } = require('celebrate');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');
const routers = require('./routes');
const { auth } = require('./middlewares/auth');
const login = require('./routes/signin');
const register = require('./routes/signup');

const app = express();
const hostname = '0.0.0.0';

const { PORT = 3000 } = process.env;

app.use(express.json());

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.use(celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(10),
  }),
}), register);

app.use(cookieParser());
app.use(auth);

app.use(routers);
app.use(rateLimit);
app.use(helmet);

app.use(errors());

app.listen(PORT, hostname, () => {
  console.log('server running on port 3000');
});
