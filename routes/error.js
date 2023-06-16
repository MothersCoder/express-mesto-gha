const router = require('express').Router();
const ERROR = require('../controllers/errors');

const errorCode = ERROR.getData.code;
const errorMessage = `Page ${ERROR.getData.message}`;

router.use('/', (req, res) => res.status(errorCode).send({ message: errorMessage }));
/* router.patch('/', (req, res) => res.status(errorCode).send({ message: errorMessage }));
router.post('/', (req, res) => res.status(errorCode).send({ message: errorMessage })); */

module.exports = router;
