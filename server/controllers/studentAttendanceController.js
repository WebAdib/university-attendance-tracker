const StudentAttendance = require('../models/studentAttendance');

exports.getAttendance = async (req, res) => {
    try {
        const attendance = await StudentAttendance.findOne({ email: req.params.email });
        res.status(200).json(attendance || {});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createAttendance = async (req, res) => {
    try {
        const attendance = new StudentAttendance(req.body);
        await attendance.save();
        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateAttendance = async (req, res) => {
    try {
        const attendance = await StudentAttendance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance not found' });
        }
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};