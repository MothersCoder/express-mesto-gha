const router = require('express').Router();

router.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: err.message || 'На сервере произошла ошибка, повторите свой запрос позже' });
  }

  next();
});

module.exports = router;
