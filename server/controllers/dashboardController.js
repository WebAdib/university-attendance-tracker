const StudentData = require('../models/StudentData');

exports.getDashboard = async (req, res) => {
    try {
        console.log('Fetching dashboard for userId:', req.user._id); // Debug log
        let studentData = await StudentData.findOne({ userId: req.user._id });

        if (!studentData) {
            console.log('No student data found, initializing new record');
            // Initialize a new record if none exists
            studentData = new StudentData({
                userId: req.user._id,
                attendanceRecords: [],
                incourseMarks: 0,
                eligibleForForm: false,
            });
            await studentData.save();
            console.log('New student data initialized:', studentData._id);
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
        console.log('Fetching attendance history for userId:', req.user._id); // Debug log
        let studentData = await StudentData.findOne({ userId: req.user._id });

        if (!studentData) {
            console.log('No student data found, initializing new record');
            // Initialize a new record if none exists
            studentData = new StudentData({
                userId: req.user._id,
                attendanceRecords: [],
                incourseMarks: 0,
                eligibleForForm: false,
            });
            await studentData.save();
            console.log('New student data initialized:', studentData._id);
        }

        res.status(200).json({ attendanceRecords: studentData.attendanceRecords });
    } catch (error) {
        console.error('Attendance history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.submitForm = async (req, res) => {
    try {
        console.log('Submitting form for userId:', req.user._id); // Debug log
        let studentData = await StudentData.findOne({ userId: req.user._id });

        if (!studentData) {
            console.log('No student data found, initializing new record');
            studentData = new StudentData({
                userId: req.user._id,
                attendanceRecords: [],
                incourseMarks: 0,
                eligibleForForm: false,
            });
            await studentData.save();
            console.log('New student data initialized:', studentData._id);
        }

        if (!studentData.eligibleForForm) {
            return res.status(403).json({ message: 'Not eligible to submit form' });
        }

        const { comments } = req.body;
        if (!comments || comments.length > 500) {
            return res.status(400).json({ message: 'Comments are required and must be under 500 characters' });
        }

        // In a real app, save to a new collection or update status
        res.status(200).json({ message: 'Form submitted successfully', comments });
    } catch (error) {
        console.error('Form submission error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};