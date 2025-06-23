const StudentAttendance = require('../models/studentAttendance');
const TeacherStatus = require('../models/TeacherStatus');
const StudentStatus = require('../models/StudentStatus');
const User = require('../models/User');
const csv = require('csv-parser');
const fs = require('fs');

exports.uploadAttendance = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                console.log('Parsed CSV data:', results);
                for (const record of results) {
                    const user = await User.findOne({ email: record.email });
                    if (user && user.role === 'student') {
                        let studentAttendance = await StudentAttendance.findOne({ email: record.email });
                        if (!studentAttendance) {
                            studentAttendance = new StudentAttendance({
                                email: record.email,
                                name: user.name || record.name || 'N/A',
                                departmentName: record.departmentName || 'N/A',
                                semester: parseInt(record.semester) || 1,
                                courses: new Map(),
                            });
                        }
                        const presentValue = String(record.present).trim().toLowerCase();
                        const isPresent = ['true', 'yes', '1'].includes(presentValue);
                        console.log(`Processing attendance for ${record.email}: date=${record.date}, present=${presentValue}, interpreted as ${isPresent}`);
                        const attendanceRecord = {
                            date: new Date(record.date),
                            present: isPresent,
                        };
                        const courseCode = record.courseCode || 'DEFAULT';
                        let courseData = studentAttendance.courses.get(courseCode);
                        if (!courseData) {
                            courseData = { attendanceRecords: [], incourseMarks: 0, eligibleForForm: 'No' };
                            studentAttendance.courses.set(courseCode, courseData);
                        }
                        courseData.attendanceRecords.push(attendanceRecord);
                        await studentAttendance.save();
                    } else {
                        console.log(`Student not found or not a student: ${record.email}`);
                    }
                }
                res.status(200).json({ message: 'Attendance uploaded successfully' });
            });
    } catch (error) {
        console.error('Upload attendance error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.uploadMarks = async (req, res) => {
    try {
        console.log('Received marks update:', req.body);
        const { email, marks, courseCode } = req.method === 'PUT' ? req.body : req.body; // Handle both POST and PUT
        if (!email || marks == null || !courseCode) {
            return res.status(400).json({ message: 'Email, marks, and courseCode are required' });
        }
        const parsedMarks = Number(marks);
        if (isNaN(parsedMarks) || parsedMarks < 0 || parsedMarks > 100) {
            return res.status(400).json({ message: 'Marks must be a number between 0 and 100' });
        }

        const user = await User.findOne({ email, role: 'student' });
        if (!user) {
            return res.status(404).json({ message: 'Student not found' });
        }

        let studentAttendance = await StudentAttendance.findOne({ email });
        if (!studentAttendance) {
            studentAttendance = new StudentAttendance({
                email: email,
                name: user.name || 'N/A',
                departmentName: 'N/A',
                semester: 1,
                courses: new Map(),
            });
        }

        let courseData = studentAttendance.courses.get(courseCode);
        if (!courseData) {
            courseData = { attendanceRecords: [], incourseMarks: 0, eligibleForForm: 'No' };
            studentAttendance.courses.set(courseCode, courseData);
        }
        courseData.incourseMarks = parsedMarks; // Update existing marks
        await studentAttendance.save();
        console.log('Marks updated for:', email, courseCode, parsedMarks);
        res.status(200).json({ message: 'Marks updated successfully' });
    } catch (error) {
        console.error('Upload marks error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudentsBySubject = async (req, res) => {
    try {
        const { subject } = req.query;
        if (!subject) {
            return res.status(400).json({ message: 'Subject is required' });
        }
        const students = await User.find({ role: 'student' }).select('name email');
        res.status(200).json({ students });
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudentsByCourse = async (req, res) => {
    try {
        const { courseCode, date } = req.query;
        if (!courseCode || !date) {
            return res.status(400).json({ message: 'Course code and date are required' });
        }
        const dateStr = new Date(date).toISOString().split('T')[0]; // e.g., "2025-06-23"

        const attendanceData = await StudentAttendance.aggregate([
            {
                $match: {
                    'courses': { $exists: true }
                }
            },
            {
                $project: {
                    email: 1,
                    name: 1,
                    coursesArray: { $objectToArray: '$courses' }
                }
            },
            {
                $unwind: '$coursesArray'
            },
            {
                $match: {
                    'coursesArray.k': courseCode
                }
            },
            {
                $unwind: '$coursesArray.v.attendanceRecords'
            },
            {
                $project: {
                    email: 1,
                    name: 1,
                    attendanceDate: { $dateToString: { format: '%Y-%m-%d', date: '$coursesArray.v.attendanceRecords.date' } },
                    present: '$coursesArray.v.attendanceRecords.present'
                }
            },
            {
                $match: {
                    attendanceDate: dateStr
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    attendanceStatus: {
                        $cond: {
                            if: '$present',
                            then: 'Present',
                            else: 'Absent'
                        }
                    }
                }
            }
        ]);

        res.status(200).json(attendanceData);
    } catch (error) {
        console.error('Get students by course error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTeacherStatus = async (req, res) => {
    try {
        const { teacherEmail } = req.query;
        if (!teacherEmail) {
            return res.status(400).json({ message: 'Teacher email is required' });
        }
        const statuses = await TeacherStatus.find({ teacherEmail })
            .select('year semester course1 course2 course3 course4 course5');
        if (!statuses.length) {
            return res.status(404).json({ message: 'No status found for this teacher' });
        }
        res.status(200).json(statuses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudentsBySemesterAndDepartment = async (req, res) => {
    try {
        const { semester, departmentName } = req.query;
        if (!semester || !departmentName) {
            return res.status(400).json({ message: 'Semester and departmentName are required' });
        }
        const students = await StudentStatus.find({ 
            departmentName, 
            semester: parseInt(semester) 
        }).select('name email');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getStudentMarks = async (req, res) => {
    try {
        const { email, courseCode } = req.query;
        if (!email || !courseCode) {
            return res.status(400).json({ message: 'Email and courseCode are required' });
        }

        const studentAttendance = await StudentAttendance.findOne({ email });
        if (!studentAttendance) {
            return res.status(404).json({ message: 'Student attendance not found' });
        }

        const courseData = studentAttendance.courses.get(courseCode);
        const incourseMarks = courseData ? courseData.incourseMarks : 0;

        res.status(200).json({ incourseMarks });
    } catch (error) {
        console.error('Get student marks error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudentAttendanceStats = async (req, res) => {
    try {
        const { email, courseCode } = req.query;
        if (!email || !courseCode) {
            return res.status(400).json({ message: 'Email and courseCode are required' });
        }

        const studentAttendance = await StudentAttendance.findOne({ email });
        if (!studentAttendance) {
            return res.status(404).json({ message: 'Student attendance not found' });
        }

        const courseData = studentAttendance.courses.get(courseCode);
        if (!courseData) {
            return res.status(404).json({ message: 'Course data not found' });
        }

        const attendanceRecords = courseData.attendanceRecords || [];
        console.log('Attendance Records:', attendanceRecords); // Debug log
        const totalDays = attendanceRecords.length;
        const daysPresent = attendanceRecords.filter(record => record.present === true).length;
        const attendancePercentage = totalDays > 0 ? ((daysPresent / totalDays) * 100).toFixed(2) : 0;

        res.status(200).json({
            daysPresent,
            totalDays,
            attendancePercentage
        });
    } catch (error) {
        console.error('Get student attendance stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateEligibleForForm = async (req, res) => {
    try {
        const { email, courseCode } = req.query;
        if (!email || !courseCode) {
            return res.status(400).json({ message: 'Email and courseCode are required' });
        }

        const studentAttendance = await StudentAttendance.findOne({ email });
        if (!studentAttendance) {
            return res.status(404).json({ message: 'Student attendance not found' });
        }

        const courseData = studentAttendance.courses.get(courseCode);
        if (!courseData) {
            return res.status(404).json({ message: 'Course data not found' });
        }

        courseData.eligibleForForm = 'Yes';
        await studentAttendance.save();

        res.status(200).json({ message: 'Eligible status updated to Yes' });
    } catch (error) {
        console.error('Update eligible status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};