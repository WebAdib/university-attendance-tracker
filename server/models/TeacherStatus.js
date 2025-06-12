const mongoose = require('mongoose');

const teacherStatusSchema = new mongoose.Schema({
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    departmentName: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'TeacherDetail', required: true },
    teacherName: { type: String, required: true },
    semester: { type: String, enum: ['First Half', 'Second Half'], required: true },
    course1: { type: String }, // Course code 1
    course2: { type: String }, // Course code 2
    course3: { type: String }, // Course code 3
    course4: { type: String }, // Course code 4
    course5: { type: String }, // Course code 5
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TeacherStatus', teacherStatusSchema);