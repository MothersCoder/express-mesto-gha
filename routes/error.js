const router = require('express').Router();
const ERROR = require('../controllers/errors');

ERROR.uploadData.message = 'Запрашиваемая страница не найдена';

router.get('/', (req, res) => res.status(ERROR.uploadData.code).send({ message: `${ERROR.uploadData.message}` }));
router.patch('/', (req, res) => res.status(ERROR.uploadData.code).send({ message: `${ERROR.uploadData.message}` }));
router.post('/', (req, res) => res.status(ERROR.uploadData.code).send({ message: `${ERROR.uploadData.message}` }));

module.exports = router;
