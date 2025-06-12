const mongoose = require('mongoose');

const teacherStatusSchema = new mongoose.Schema({
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    departmentName: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'TeacherDetail', required: true },
    teacherName: { type: String, required: true },
    teacherEmail: { type: String, required: true },
    semester: { type: String, enum: ['First Half', 'Second Half'], required: true },
    course1: { type: String },
    course2: { type: String },
    course3: { type: String },
    course4: { type: String },
    course5: { type: String },
    createdAt: { type: Date, default: Date.now },
});

// Unique constraint for teacher and semester combination
teacherStatusSchema.index({ teacher: 1, semester: 1 }, { unique: true });

// Custom validator to prevent duplicate course codes
teacherStatusSchema.pre('save', function(next) {
    const courses = [this.course1, this.course2, this.course3, this.course4, this.course5].filter(code => code);
    const uniqueCourses = new Set(courses);
    if (courses.length !== uniqueCourses.size) {
        return next(new Error('Duplicate course codes are not allowed'));
    }
    next();
});

module.exports = mongoose.model('TeacherStatus', teacherStatusSchema);