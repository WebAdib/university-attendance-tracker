const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const teacherController = require('../controllers/teacherController');
const adminController = require('../controllers/adminController');
const studentAttendanceController = require('../controllers/studentAttendanceController');
const { authMiddleware, restrictTo } = require('../middlewares/authMiddleware');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/users', authMiddleware, restrictTo('admin'), userController.createUser);
router.get('/users', authMiddleware, restrictTo('admin'), adminController.getUsers);
router.get('/users/:id', authMiddleware, restrictTo('admin', 'teacher','student'), userController.getUserById);
router.delete('/users', authMiddleware, restrictTo('admin'), adminController.deleteUser);
router.post('/users/bulk', authMiddleware, restrictTo('admin'), upload.single('file'), userController.bulkUploadUsers);
router.post('/auth/login', authController.login);
router.get('/departments', authMiddleware, restrictTo('admin'), adminController.getDepartments);
router.post('/departments', authMiddleware, restrictTo('admin'), adminController.addDepartment);
router.post('/courses', authMiddleware, restrictTo('admin'), adminController.addCourse);
router.post('/courses/bulk', authMiddleware, restrictTo('admin'), upload.single('file'), adminController.bulkUploadCourses);
router.post('/notices', authMiddleware, restrictTo('admin'), adminController.addNotice);
router.post('/form-fill-up', authMiddleware, restrictTo('admin'), upload.single('file'), adminController.setFormFillUp);
router.get('/students/submit-form/status', authMiddleware, restrictTo('admin'), adminController.getFormSubmissions);
router.get('/students/dashboard', authMiddleware, restrictTo('student', 'admin'), dashboardController.getDashboard);
router.get('/students/attendance-history', authMiddleware, restrictTo('student'), dashboardController.getAttendanceHistory);
router.post('/students/submit-form', authMiddleware, restrictTo('student'), dashboardController.submitForm);
router.post('/teachers/upload-attendance', authMiddleware, restrictTo('teacher'), upload.single('file'), teacherController.uploadAttendance);
router.post('/teachers/upload-marks', authMiddleware, restrictTo('teacher'), teacherController.uploadMarks);
router.get('/teachers/students', authMiddleware, restrictTo('teacher'), teacherController.getStudentsBySubject);
router.post('/teachers/details', authMiddleware, restrictTo('admin'), adminController.addTeacherDetails); 
router.post('/students/details', authMiddleware, restrictTo('student','admin'), adminController.addStudentDetails); 
router.post('/teacher-status', authMiddleware, restrictTo('admin'), adminController.addTeacherStatus);
router.get('/teachers/status', authMiddleware, restrictTo('teacher', 'admin'), teacherController.getTeacherStatus);
router.get('/teachers/details', authMiddleware, restrictTo('teacher','admin'), adminController.getTeachersByDepartment);
router.get('/teachers/detail', authMiddleware, restrictTo('teacher','admin'), adminController.getTeacherDetails);
router.get('/teachers/students-by-course', authMiddleware, restrictTo('teacher', 'admin'), teacherController.getStudentsByCourse);
router.put('/teachers/upload-marks', authMiddleware, restrictTo('teacher', 'admin'), teacherController.uploadMarks);
router.get('/teachers/student-marks', authMiddleware, restrictTo('teacher', 'admin'), teacherController.getStudentMarks);
router.get('/teachers/student-attendance-stats', authMiddleware, restrictTo('teacher', 'admin'), teacherController.getStudentAttendanceStats);
router.put('/teachers/update-eligible', authMiddleware, restrictTo('teacher', 'admin'), teacherController.updateEligibleForForm);
router.get('/teachers/students-by-semester-dept', authMiddleware, restrictTo('teacher'), teacherController.getStudentsBySemesterAndDepartment);
router.get('/students/status/courses', authMiddleware, restrictTo('admin'), adminController.getStudentStatusCourses);
router.post('/students/status', authMiddleware, restrictTo('admin'), adminController.saveStudentStatus);
router.get('/courses', authMiddleware, restrictTo('teacher', 'admin'), adminController.getCourses);
router.get('/students/attendance/:email', authMiddleware, restrictTo('teacher', 'admin'), studentAttendanceController.getAttendance);
router.post('/students/attendance', authMiddleware, restrictTo('teacher', 'admin'), studentAttendanceController.createAttendance);
router.put('/students/attendance/:id', authMiddleware, restrictTo('teacher', 'admin'), studentAttendanceController.updateAttendance);
router.get('/students/detail', dashboardController.getStudentDetails);
router.get('/students/assigned-courses', dashboardController.getAssignedCourses);



module.exports = router;