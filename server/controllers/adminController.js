const User = require('../models/User');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Notice = require('../models/Notice');
const TeacherDetail = require('../models/TeacherDetails');
const StudentDetail = require('../models/StudentDetails');
const TeacherStatus = require('../models/TeacherStatus');
const StudentStatus = require('../models/StudentStatus');
const StudentAttendance = require('../models/studentAttendance');
const FormFillup = require('../models/FormFillup');
const multer = require('multer');
const fs = require('fs').promises;
const csv = require('csv-parser');
const path = require('path');

const upload = multer({ dest: 'uploads/' });

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('name email role');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { email, adminPassword } = req.body;
        const admin = await User.findOne({ email: req.user.email, role: 'admin' });
        if (!admin || admin.password !== adminPassword) {
            return res.status(403).json({ message: 'Invalid admin password' });
        }
        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().select('name');
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addDepartment = async (req, res) => {
    try {
        const { name } = req.body;
        const department = new Department({ name });
        await department.save();
        res.status(201).json({ message: 'Department added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addCourse = async (req, res) => {
    try {
        const { name, courseCode, creditHours, department, semester } = req.body;
        const selectedDept = await Department.findById(department);
        if (!selectedDept) {
            return res.status(400).json({ message: 'Invalid department' });
        }
        const course = new Course({
            name,
            courseCode,
            creditHours,
            department,
            departmentName: selectedDept.name,
            semester,
        });
        await course.save();
        res.status(201).json({ message: 'Course added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.bulkUploadCourses = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const results = [];
        const stream = require('fs').createReadStream(req.file.path).pipe(csv());

        for await (const data of stream) {
            results.push(data);
        }

        console.log('Parsed CSV data:', results);

        for (const record of results) {
            const { name, courseCode, creditHours, departmentName, semester } = record;
            if (name && courseCode && creditHours && departmentName && semester) {
                const department = await Department.findOne({ name: departmentName });
                if (!department) {
                    console.log(`Department not found: ${departmentName}`);
                    continue;
                }
                const course = new Course({
                    name,
                    courseCode,
                    creditHours: parseInt(creditHours),
                    department: department._id,
                    departmentName,
                    semester: parseInt(semester),
                });
                await course.save();
                console.log(`Course created: ${name}`);
            } else {
                console.log(`Invalid record: ${JSON.stringify(record)}`);
            }
        }

        await fs.unlink(req.file.path);
        res.status(200).json({ message: 'Bulk courses uploaded successfully' });
    } catch (error) {
        console.error('Bulk upload error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addNotice = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        const notice = new Notice({ title, content });
        await notice.save();
        res.status(201).json({ message: 'Notice added successfully', notice });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getNotices = async (req, res) => {
    try {
        const notices = await Notice.find();
        res.status(200).json(notices);
    } catch (error) {
        console.error('Get notices error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const notice = await Notice.findByIdAndDelete(id);
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }
        res.status(200).json({ message: 'Notice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.setFormFillUp = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Received file:', req.file);
        const { startDate, endDate } = req.body;
        const file = req.file;

        if (!startDate || !endDate || !file) {
            return res.status(400).json({ message: 'All fields (start date, end date, and PDF) are required' });
        }

        // Generate a unique filename
        const uniqueFilename = `${Date.now()}-${file.originalname}`;
        const filePath = path.join('uploads', uniqueFilename);

        // Move the uploaded file to the desired location
        await fs.rename(file.path, filePath);
        console.log('File moved to:', filePath);

        const formFillup = await FormFillup.create({
            startDate,
            endDate,
            file: filePath
        });

        res.status(200).json({ message: 'Form released successfully', formFillup });
    } catch (error) {
        console.error('Set form fill-up error:', error);
        if (req.file) {
            await fs.unlink(req.file.path).catch(err => console.error('Failed to clean up file:', err)); // Cleanup on failure
        }
        res.status(500).json({ message: 'Failed to release form' });
    }
};
exports.getLatestFormFillUp = async (req, res) => {
    try {
        const latestForm = await FormFillup.findOne().sort({ createdAt: -1 }); // Get the most recent record
        if (!latestForm) {
            return res.status(404).json({ message: 'No form available' });
        }
        res.status(200).json(latestForm);
    } catch (error) {
        console.error('Get latest form error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.downloadFormFillUp = async (req, res) => {
    try {
        const filePath = req.params.filePath;
        const fullPath = path.join(__dirname, '..', filePath); // Adjust based on your project structure
        await fs.access(fullPath, fs.constants.F_OK); // Check if file exists
        res.download(fullPath, filePath.split('/').pop(), (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(500).json({ message: 'Failed to download file' });
            }
        });
    } catch (error) {
        console.error('Download file error:', error);
        res.status(500).json({ message: 'File not found' });
    }
};

exports.getFormSubmissions = async (req, res) => {
    try {
        const submissions = await FormFillup.find().select('studentId eligible filled');
        res.status(200).json(submissions);
    } catch (error) {
        console.error('Get form submissions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addTeacherDetails = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, address, department, designation } = req.body;
        const user = await User.findOne({ email, role: 'teacher' });
        if (!user) {
            return res.status(400).json({ message: 'No matching teacher email found in user list' });
        }
        const existingDetail = await TeacherDetail.findOne({ email });
        if (existingDetail) {
            return res.status(400).json({ message: 'Teacher details already exist for this email' });
        }
        const selectedDept = await Department.findById(department);
        if (!selectedDept) {
            return res.status(400).json({ message: 'Invalid department' });
        }
        const teacherDetail = new TeacherDetail({
            fullName,
            email,
            phoneNumber,
            address,
            department: selectedDept._id,
            departmentName: selectedDept.name, 
            designation,
            user: user._id,
        });
        await teacherDetail.save();
        res.status(201).json({ message: 'Teacher details added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addStudentDetails = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, enrollmentYear, guardianContact, department } = req.body;
        const user = await User.findOne({ email, role: 'student' });
        if (!user) {
            return res.status(400).json({ message: 'No matching student email found in user list' });
        }
        const existingDetail = await StudentDetail.findOne({ email });
        if (existingDetail) {
            return res.status(400).json({ message: 'Student details already exist for this email' });
        }
        const selectedDept = await Department.findById(department);
        if (!selectedDept) {
            return res.status(400).json({ message: 'Invalid department' });
        }
        const studentDetail = new StudentDetail({
            fullName,
            email,
            phoneNumber,
            enrollmentYear,
            guardianContact,
            department: selectedDept._id,
            departmentName: selectedDept.name,
            user: user._id,
        });
        await studentDetail.save();
        res.status(201).json({ message: 'Student details added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTeachersByDepartment = async (req, res) => {
    try {
        const { department } = req.query;
        if (department) {
            const deptTeachers = await TeacherDetail.find({ department }).select('fullName email departmentName');
            res.status(200).json(deptTeachers.sort((a, b) => a.fullName.localeCompare(b.fullName)));
        } else {
            const allTeachers = await TeacherDetail.find().select('fullName email departmentName');
            res.status(200).json(allTeachers.sort((a, b) => a.fullName.localeCompare(b.fullName)));
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTeacherDetails = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const teacherDetail = await TeacherDetail.findOne({ email }).select('fullName email phoneNumber address departmentName designation');
        res.status(200).json(teacherDetail || {});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addTeacherStatus = async (req, res) => {
    try {
        const { department, teacher, semester, year, course1, course2, course3, course4, course5 } = req.body;
        console.log('Request body:', { department, teacher, semester, year, course1, course2, course3, course4, course5 });

        const selectedDept = await Department.findById(department);
        if (!selectedDept) {
            return res.status(400).json({ message: 'Invalid department' });
        }

        const teacherDetail = await TeacherDetail.findById(teacher).select('fullName email department');
        console.log('Teacher detail found:', teacherDetail);
        if (!teacherDetail) {
            return res.status(400).json({ message: 'Invalid teacher ID' });
        }
        if (!teacherDetail.department || teacherDetail.department.toString() !== department) {
            return res.status(400).json({ message: 'Department mismatch or invalid teacher department' });
        }

        if (!year || isNaN(year) || year < 2000 || year > 2100) {
            return res.status(400).json({ message: 'Invalid year' });
        }

        const courses = [course1, course2, course3, course4, course5].filter(code => code);
        for (const code of courses) {
            const course = await Course.findOne({ courseCode: code });
            if (!course) {
                return res.status(400).json({ message: `Invalid course code: ${code}` });
            }
        }

        const existingStatus = await TeacherStatus.findOne({ teacher, semester, year });
        if (existingStatus) {
            return res.status(400).json({ message: 'Teacher already has a status for this semester and year' });
        }

        const teacherStatus = new TeacherStatus({
            department: selectedDept._id,
            departmentName: selectedDept.name,
            teacher: teacherDetail._id,
            teacherName: teacherDetail.fullName,
            teacherEmail: teacherDetail.email || '',
            semester,
            year,
            course1,
            course2,
            course3,
            course4,
            course5,
        });
        await teacherStatus.save();
        res.status(201).json({ message: 'Teacher status added successfully' });
    } catch (error) {
        console.error('Teacher status error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Teacher already has a status for this semester and year' });
        } else if (error.message.includes('Duplicate course codes are not allowed')) {
            return res.status(400).json({ message: 'Duplicate course codes are not allowed' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudentStatusCourses = async (req, res) => {
    try {
        const { email, semester } = req.query;
        if (!email || !semester) {
            return res.status(400).json({ message: 'Email and semester are required' });
        }

        const studentDetail = await StudentDetail.findOne({ email });
        if (!studentDetail) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const courses = await Course.find({
            department: studentDetail.department,
            semester: parseInt(semester),
        }).select('courseCode name creditHours');

        res.status(200).json(courses);
    } catch (error) {
        console.error('Student status courses error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.saveStudentStatus = async (req, res) => {
    try {
        const { email, paymentStatus, semester } = req.body;
        if (!email || !paymentStatus || !semester) {
            return res.status(400).json({ message: 'Email, payment status, and semester are required' });
        }
        if (paymentStatus !== 'done' && paymentStatus !== 'pending') {
            return res.status(400).json({ message: 'Invalid payment status' });
        }

        const studentDetail = await StudentDetail.findOne({ email });
        if (!studentDetail) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const existingStatus = await StudentStatus.findOne({ email, semester: parseInt(semester) });
        if (existingStatus && paymentStatus === 'done') {
            return res.status(400).json({ message: 'Student status already confirmed for this semester' });
        }

        const studentStatus = new StudentStatus({
            email: studentDetail.email,
            name: studentDetail.fullName,
            departmentName: studentDetail.departmentName,
            semester: parseInt(semester),
            paymentStatus,
        });
        await studentStatus.save();

        // Create studentAttendance document
        const courses = await Course.find({
            department: studentDetail.department,
            semester: parseInt(semester),
        }).select('courseCode');

        const attendanceData = {
            email: studentDetail.email,
            name: studentDetail.fullName,
            departmentName: studentDetail.departmentName,
            semester: parseInt(semester),
            courses: new Map(),
        };

        courses.forEach(course => {
            attendanceData.courses.set(course.courseCode, {
                attendanceRecords: [],
                incourseMarks: 0,
                eligibleForForm: 'No',
            });
        });

        const studentAttendance = new StudentAttendance(attendanceData);
        await studentAttendance.save();

        res.status(201).json({ message: 'Student status and attendance saved successfully' });
    } catch (error) {
        console.error('Save student status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id).select('name');
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCourses = async (req, res) => {
    try {
        const { courseCode } = req.query;
        if (!courseCode) {
            return res.status(400).json({ message: 'Course code is required' });
        }
        const courses = await Course.find({ courseCode }).select('semester departmentName');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};