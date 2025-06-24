const mongoose = require('mongoose');

const formFillupSchema = new mongoose.Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    file: { type: String, required: true } // Path to the uploaded PDF
}, { timestamps: true });

module.exports = mongoose.model('FormFillup', formFillupSchema);