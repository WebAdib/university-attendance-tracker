const StudentData = require('../models/StudentData');

exports.getDashboard = async (req, res) => {
    try {
        const studentData = await StudentData.findOne({ userId: req.user._id });
        if (!studentData) {
            return res.status(404).json({ message: 'Student data not found' });
        }
        const totalDays = studentData.attendanceRecords.length;
        const presentDays = studentData.attendanceRecords.filter(record => record.present).length;
        const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
        const dashboardData = {
            attendancePercentage: attendancePercentage.toFixed(2),
            incourseMarks: studentData.incourseMarks,
            eligibleForForm: studentData.eligibleForForm,
        };
        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAttendanceHistory = async (req, res) => {
    try {
        const studentData = await StudentData.findOne({ userId: req.user._id });
        if (!studentData) {
            return res.status(404).json({ message: 'Student data not found' });
        }
        res.status(200).json({ attendanceRecords: studentData.attendanceRecords });
    } catch (error) {
        console.error('Attendance history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.submitForm = async (req, res) => {
    try {
        const studentData = await StudentData.findOne({ userId: req.user._id });
        if (!studentData) {
            return res.status(404).json({ message: 'Student data not found' });
        }
        if (!studentData.eligibleForForm) {
            return res.status(403).json({ message: 'Not eligible to submit form' });
        }
        // Simulate form submission with validation
        const { comments } = req.body;
        if (!comments || comments.length > 500) {
            return res.status(400).json({ message: 'Comments are required and must be under 500 characters' });
        }
        // In a real app, save to a new collection or update status
        res.status(200).json({ message: 'Form submitted successfully', comments });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};