const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware, restrictTo } = require('../middlewares/authMiddleware');

router.post('/users', userController.createUser);
router.get('/users', authMiddleware, restrictTo('admin'), userController.getUsers);
router.get('/students/dashboard', authMiddleware, restrictTo('student'), dashboardController.getDashboard);

module.exports = router;