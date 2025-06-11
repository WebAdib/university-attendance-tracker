const StudentData = require('../models/StudentData');
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
                console.log('Parsed CSV data:', results); // Debug the parsed data
                for (const record of results) {
                    const user = await User.findOne({ email: record.email });
                    if (user && user.role === 'student') {
                        const studentData = await StudentData.findOne({ userId: user._id });
                        if (studentData) {
                            const presentValue = String(record.present).trim().toLowerCase();
                            const isPresent = ['true', 'yes', '1'].includes(presentValue);
                            console.log(`Processing attendance for ${record.email}: date=${record.date}, present=${presentValue}, interpreted as ${isPresent}`); // Debug each record
                            const attendanceRecord = {
                                date: new Date(record.date),
                                present: isPresent,
                            };
                            studentData.attendanceRecords.push(attendanceRecord);
                            await studentData.save();
                        } else {
                            console.log(`Student data not found for ${record.email}`);
                        }
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
        const { email, marks } = req.body;
        if (!email || marks == null) {
            return res.status(400).json({ message: 'Email and marks are required' });
        }
        const parsedMarks = Number(marks);
        if (isNaN(parsedMarks) || parsedMarks < 0 || parsedMarks > 100) {
            return res.status(400).json({ message: 'Marks must be a number between 0 and 100' });
        }

        const user = await User.findOne({ email, role: 'student' });
        if (!user) {
            return res.status(404).json({ message: 'Student not found' });
        }

        let studentData = await StudentData.findOne({ userId: user._id });
        if (!studentData) {
            studentData = new StudentData({ userId: user._id, attendanceRecords: [], incourseMarks: 0 });
            await studentData.save();
        }

        studentData.incourseMarks = parsedMarks;
        await studentData.save();
        console.log('Marks updated for:', email, parsedMarks);
        res.status(200).json({ message: 'Marks updated successfully' });
    } catch (error) {
        console.error('Upload marks error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudentsBySubject = async (req, res) => {
    try {
        const { subject } = req.query; // Assume subject is passed as a query parameter
        if (!subject) {
            return res.status(400).json({ message: 'Subject is required' });
        }

        // For simplicity, assume all students are under a default subject for now
        const students = await User.find({ role: 'student' }).select('name email');
        res.status(200).json({ students });
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};