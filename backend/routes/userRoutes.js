const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getAllUsers, updateUser, getUserById } = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserProfile);
router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.get('/:id', authMiddleware, adminMiddleware, getUserById);
router.patch('/profile', authMiddleware, require('../controllers/userController').updateUserProfile);
router.patch('/:id', authMiddleware, adminMiddleware, updateUser);

module.exports = router;
