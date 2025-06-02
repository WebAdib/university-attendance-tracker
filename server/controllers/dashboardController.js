exports.getDashboard = async (req, res) => {
    try {
        // Mock data (replace with real database query later)
        const dashboardData = {
            attendancePercentage: 85,
            incourseMarks: 75,
            eligibleForForm: true,
        };
        res.status(200).json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};