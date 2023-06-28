const router = require('express').Router();
const {
  getUsers, getUserById, changeUserData, changeUserAvatar, getUserData,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.get('/me', getUserData);
router.patch('/me', changeUserData);
router.patch('/me/avatar', changeUserAvatar);

module.exports = router;
