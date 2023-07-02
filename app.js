const express = require('express');

const rateLimit = require('express-rate-limit');

const { errors } = require('celebrate');

const helmet = require('helmet');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const routers = require('./routes');
const { auth } = require('./middlewares/auth');
const login = require('./routes/signin');
const register = require('./routes/signup');
const { error } = require('./middlewares/error');

const app = express();
const hostname = '0.0.0.0';

const { PORT = 3000 } = process.env;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(limiter);
app.use(helmet());

app.use(login);
app.use(register);

app.use(cookieParser());
app.use(auth);

app.use(routers);
app.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

app.use(errors());
app.use(error);

app.listen(PORT, hostname, () => {
  console.log('server running on port 3000');
});
