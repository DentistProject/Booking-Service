const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    patientID: { type: String },
    dentistID: { type: String, required: true },
    dentistName: { type: String, required: true },
    patientName: { type: String },
    patientEmail: { type: String },
    status: {
        type: String,
        required: true,
        enum: ['AVAILABLE', 'CANCELED', 'BOOKED'],
    },
    date: {
        type: String,
        required: true,
        match: [/^\d{4}-\d{2}-\d{2}$/, 'is not a valid date format']
    },
    time: { type: String, required: true },
    message: String
});

module.exports = mongoose.model('Booking', bookingSchema);