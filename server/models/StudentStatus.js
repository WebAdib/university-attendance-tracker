const mongoose = require('mongoose');

const studentStatusSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    departmentName: { type: String, required: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    paymentStatus: { type: String, enum: ['done', 'pending'], required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('StudentStatus', studentStatusSchema);