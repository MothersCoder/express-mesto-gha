const router = require('express').Router();
const {
  createUser, getUsers, getUserById, changeUserData, changeUserAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/me', changeUserData);
router.patch('/me/avatar', changeUserAvatar);

module.exports = router;
