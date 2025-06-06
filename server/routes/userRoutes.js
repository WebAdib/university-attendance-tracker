const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const dashboardController = require('../controllers/dashboardController');
const teacherController = require('../controllers/teacherController');
const { authMiddleware, restrictTo } = require('../middlewares/authMiddleware');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); // Configure multer for file uploads

router.post('/users', authMiddleware, restrictTo('admin'), userController.createUser);
router.get('/users', authMiddleware, restrictTo('admin'), userController.getUsers);
router.put('/users/:id', authMiddleware, restrictTo('admin'), userController.updateUser);
router.delete('/users/:id', authMiddleware, restrictTo('admin'), userController.deleteUser);
router.post('/login', userController.login);
router.get('/students/dashboard', authMiddleware, restrictTo('student'), dashboardController.getDashboard);
router.get('/students/attendance-history', authMiddleware, restrictTo('student'), dashboardController.getAttendanceHistory);
router.post('/students/submit-form', authMiddleware, restrictTo('student'), dashboardController.submitForm);
router.post('/teachers/upload-attendance', authMiddleware, restrictTo('teacher'), upload.single('file'), teacherController.uploadAttendance);
router.post('/teachers/upload-marks', authMiddleware, restrictTo('teacher'), teacherController.uploadMarks);
router.get('/teachers/students', authMiddleware, restrictTo('teacher'), teacherController.getStudentsBySubject);

module.exports = router;