const StudentData = require('../models/StudentData');

exports.getDashboard = async (req, res) => {
    try {
        const studentData = await StudentData.findOne({ userId: req.user._id });
        if (!studentData) {
            return res.status(404).json({ message: 'Student data not found' });
        }

        // Calculate attendance percentage
        const totalDays = studentData.attendanceRecords.length;
        const presentDays = studentData.attendanceRecords.filter(record => record.present).length;
        const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

        // Prepare response
        const dashboardData = {
            attendancePercentage: attendancePercentage.toFixed(2),
            incourseMarks: studentData.incourseMarks,
            eligibleForForm: studentData.eligibleForForm,
        };

        res.status(200).json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};