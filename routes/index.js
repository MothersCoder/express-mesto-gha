const router = require('express').Router();
const userRouters = require('./users');
const cardRouters = require('./cards');

router.use('/users', userRouters);
router.use('/cards', cardRouters);

module.exports = router;
