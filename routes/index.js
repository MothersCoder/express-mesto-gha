const router = require('express').Router();
const userRouters = require('./users');
const cardRouters = require('./cards');
const wrongRout = require('../middlewares/error');

router.use('/users', userRouters);
router.use('/cards', cardRouters);

router.use('*', wrongRout);

module.exports = router;
