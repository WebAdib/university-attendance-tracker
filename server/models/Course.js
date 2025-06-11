const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Just the course name
    courseCode: { type: String, required: true }, // Course code (e.g., CS101)
    creditHours: { type: Number, required: true }, // Credit hours
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    departmentName: { type: String, required: true }, // Store department name for reference
    semester: { type: Number, required: true }, // Semester (1-8)
});

module.exports = mongoose.model('Course', courseSchema);