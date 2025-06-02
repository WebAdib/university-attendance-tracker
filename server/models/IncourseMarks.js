const mongoose = require('mongoose');

const incourseMarksSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    mark: { type: Number, required: true },
});



module.exports = mongoose.model('IncourseMarks', incourseMarksSchema);