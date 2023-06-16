const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
const mongoose = require('mongoose');
const routers = require('./routes');

const app = express();
const hostname = '0.0.0.0';

const { PORT = 3000 } = process.env;

app.use(express.json());

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '648a180209e0aa45d94f1c8f',
  };

  next();
});

app.use(routers);
app.use(rateLimit);
app.use(helmet);

app.listen(PORT, hostname, () => {
  console.log('server running on port 3000');
});
