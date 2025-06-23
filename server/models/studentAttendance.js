const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
    date: { type: Date, default: null },
    present: { type: Boolean, default: null },
});

const courseAttendanceSchema = new mongoose.Schema({
    attendanceRecords: [attendanceRecordSchema],
    incourseMarks: { type: Number, default: 0 },
    eligibleForForm: { type: String, enum: ['Yes', 'No'], default: 'No' },
});

const studentAttendanceSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    departmentName: { type: String, required: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    courses: { type: Map, of: courseAttendanceSchema, default: {} },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('studentAttendance', studentAttendanceSchema);