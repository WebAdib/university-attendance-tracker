const mongoose = require('mongoose');

const studentDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    attendanceRecords: [
        {
            date: { type: Date, default: Date.now },
            present: { type: Boolean, required: true },
        },
    ],
    incourseMarks: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    eligibleForForm: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('StudentData', studentDataSchema);