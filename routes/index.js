const router = require('express').Router();
const userRouters = require('./users');
const cardRouters = require('./cards');
const NotFoundError = require('../errors/not-found-err');

router.use('/users', userRouters);
router.use('/cards', cardRouters);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Неверный адрес запроса'));
});

module.exports = router;
