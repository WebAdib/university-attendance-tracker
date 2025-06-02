const mongoose = require('mongoose');

const formFillupSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eligible: { type: Boolean, default: false },
    filled: { type: Boolean, default: false },
});

module.exports = mongoose.model('FormFillup', formFillupSchema);