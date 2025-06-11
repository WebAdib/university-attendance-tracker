const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController'); // Ensure this is included
const dashboardController = require('../controllers/dashboardController');
const teacherController = require('../controllers/teacherController');
const adminController = require('../controllers/adminController');
const { authMiddleware, restrictTo } = require('../middlewares/authMiddleware');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/users', authMiddleware, restrictTo('admin'), userController.createUser);
router.get('/users', authMiddleware, restrictTo('admin'), adminController.getUsers);
router.delete('/users', authMiddleware, restrictTo('admin'), adminController.deleteUser);
router.post('/users/bulk', authMiddleware, restrictTo('admin'), upload.single('file'), userController.bulkUploadUsers);
router.post('/auth/login', authController.login);
router.post('/departments', authMiddleware, restrictTo('admin'), adminController.addDepartment);
router.post('/courses', authMiddleware, restrictTo('admin'), adminController.addCourse);
router.post('/notices', authMiddleware, restrictTo('admin'), adminController.addNotice);
router.post('/form-fill-up', authMiddleware, restrictTo('admin'), upload.single('file'), adminController.setFormFillUp);
router.get('/students/submit-form/status', authMiddleware, restrictTo('admin'), adminController.getFormSubmissions);
router.get('/students/dashboard', authMiddleware, restrictTo('student', 'admin'), dashboardController.getDashboard);
router.get('/students/attendance-history', authMiddleware, restrictTo('student'), dashboardController.getAttendanceHistory);
router.post('/students/submit-form', authMiddleware, restrictTo('student'), dashboardController.submitForm);
router.post('/teachers/upload-attendance', authMiddleware, restrictTo('teacher'), upload.single('file'), teacherController.uploadAttendance);
router.post('/teachers/upload-marks', authMiddleware, restrictTo('teacher'), teacherController.uploadMarks);
router.get('/teachers/students', authMiddleware, restrictTo('teacher'), teacherController.getStudentsBySubject);

module.exports = router;