const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    patientID: { type: Schema.Types.ObjectId, ref: 'Patient' },
    dentistID: { type: Schema.Types.ObjectId, ref: 'Dentist' },
    dentistName: { type: String, required: true },
    patientName: { type: String, required: true },
    date: {
        type: String,
        required: true,
        match: [/^\d{4}-\d{2}-\d{2}$/, 'is not a valid date format']
    },
    time: { type: String, required: true },
    message: String
});

module.exports = mongoose.model('Booking', bookingSchema);