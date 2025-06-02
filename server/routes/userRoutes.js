const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, restrictTo } = require('../middlewares/authMiddleware');

router.post('/users', userController.createUser); // Unprotected for now
router.get('/users', authMiddleware, restrictTo('admin'), userController.getUsers);

module.exports = router;