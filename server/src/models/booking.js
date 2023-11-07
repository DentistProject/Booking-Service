const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    patientID: { type: Schema.Types.ObjectId, ref: 'Patient' },
    dentistID: { type: Schema.Types.ObjectId, ref: 'Dentist' },
    dentistName: String,
    patientName: String,
    date: String,
    time: String,
    message: String
});

module.exports = mongoose.model('Booking', bookingSchema);