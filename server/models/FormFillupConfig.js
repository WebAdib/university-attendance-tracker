const mongoose = require('mongoose');

const formFillupConfigSchema = new mongoose.Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
});

module.exports = mongoose.model('FormFillupConfig', formFillupConfigSchema);