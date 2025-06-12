const User = require('../models/User');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Notice = require('../models/Notice');
const TeacherDetail = require('../models/TeacherDetails');
const StudentDetail = require('../models/StudentDetails');
const TeacherStatus = require('../models/TeacherStatus');
const StudentStatus = require('../models/StudentStatus');
const multer = require('multer');
const fs = require('fs').promises;
const csv = require('csv-parser');

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
        const { title, content, startDate, endDate } = req.body;
        const notice = new Notice({ title, content, startDate, endDate });
        await notice.save();
        res.status(201).json({ message: 'Notice added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.setFormFillUp = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        res.status(200).json({ message: 'Form fill-up dates set successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getFormSubmissions = async (req, res) => {
    try {
        
        const submissions = await api.get('/students/submit-form/status'); 
        res.status(200).json(submissions.data);
    } catch (error) {
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
            departmentName: selectedDept.name, // Set department name
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
        const teacherDetail = await TeacherDetail.findOne({ email }).select('fullName email phoneNumber address department designation');
        if (teacherDetail && teacherDetail.department) {
            const department = await Department.findById(teacherDetail.department).select('name');
            teacherDetail.department = department ? { name: department.name } : null;
        }
        res.status(200).json(teacherDetail || {});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.addTeacherStatus = async (req, res) => {
    try {
        const { department, teacher, semester, course1, course2, course3, course4, course5 } = req.body;
        console.log('Request body:', { department, teacher, semester, course1, course2, course3, course4, course5 }); // Log all inputs

        const selectedDept = await Department.findById(department);
        if (!selectedDept) {
            return res.status(400).json({ message: 'Invalid department' });
        }

        const teacherDetail = await TeacherDetail.findById(teacher).select('fullName email department');
        console.log('Teacher detail found:', teacherDetail); // Log the retrieved teacher detail
        if (!teacherDetail) {
            return res.status(400).json({ message: 'Invalid teacher ID' });
        }
        if (!teacherDetail.department || teacherDetail.department.toString() !== department) {
            return res.status(400).json({ message: 'Department mismatch or invalid teacher department' });
        }

        const courses = [course1, course2, course3, course4, course5].filter(code => code);
        for (const code of courses) {
            const course = await Course.findOne({ courseCode: code });
            if (!course) {
                return res.status(400).json({ message: `Invalid course code: ${code}` });
            }
        }

        // Check for existing teacher status for the same semester
        const existingStatus = await TeacherStatus.findOne({ teacher, semester });
        if (existingStatus) {
            return res.status(400).json({ message: 'Teacher already has a status for this semester' });
        }

        const teacherStatus = new TeacherStatus({
            department: selectedDept._id,
            departmentName: selectedDept.name,
            teacher: teacherDetail._id,
            teacherName: teacherDetail.fullName,
            teacherEmail: teacherDetail.email || '',
            semester,
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
            return res.status(400).json({ message: 'Teacher already has a status for this semester' });
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
        const { email, paymentStatus } = req.body;
        if (!email || !paymentStatus) {
            return res.status(400).json({ message: 'Email and payment status are required' });
        }
        if (paymentStatus !== 'done' && paymentStatus !== 'pending') {
            return res.status(400).json({ message: 'Invalid payment status' });
        }

        const studentDetail = await StudentDetail.findOne({ email });
        if (!studentDetail) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const existingStatus = await StudentStatus.findOne({ email, semester: studentDetail.semester });
        if (existingStatus && paymentStatus === 'done') {
            return res.status(400).json({ message: 'Student status already confirmed for this semester' });
        }

        const studentStatus = new StudentStatus({
            email: studentDetail.email,
            name: studentDetail.fullName,
            departmentName: studentDetail.departmentName,
            semester: parseInt(req.body.semester),
            paymentStatus,
        });
        await studentStatus.save();

        res.status(201).json({ message: 'Student status saved successfully' });
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