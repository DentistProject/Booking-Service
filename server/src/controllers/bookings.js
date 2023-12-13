const Booking = require('../models/booking');
const mqttClient = require('../mqtt');

const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(bookingID);
    if (!booking) return res.status(404).json({ 'message': 'Booking not found' });
    res.json(booking);
  } catch (err) {
    next(err);
  }
}

const getBookingsByDentist = async (req, res, next) => {
  const dentistID = req.params.id;
  try {
    const bookings = await Booking.find({ dentistID });
    if (!bookings) return res.status(404).json({ 'message': 'Booking not found for this dentist' });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

const getBookingsByDentistAvailable = async (req, res, next) => {
  const dentistID = req.params.id;

  try {
    const bookings = await Booking.find({ dentistID, status: 'AVAILABLE' });
    if (!bookings) return res.status(404).json({ 'message': 'No available booking found for this dentist' });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

const getBookingsByPatient = async (req, res, next) => {
  const patientID = req.params.id;
  
  try {
    const bookings = await Booking.find({ patientID});
    if (!bookings) return res.status(404).json({ 'message': 'Booking not found for this patient' });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

const createBooking = async (req, res, next) => {
  const booking = new Booking(req.body);

  try {
    await booking.save();
    console.log(booking);
    mqttClient.sendMessage('booking', JSON.stringify(booking));
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
}

const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).send();

    booking.patientID = req.body.patientID || booking.patientID;
    booking.dentistID = req.body.dentistID || booking.dentistID;
    booking.dentistName = req.body.dentistName || booking.dentistName;
    booking.patientName = req.body.patientName || booking.patientName;
    booking.patientEmail = req.body.patientEmail || booking.patientEmail;
    booking.status = req.body.status || booking.status;
    booking.date = req.body.date || booking.date;
    booking.time = req.body.time || booking.time;
    booking.message = req.body.message || booking.message;

    await booking.save();
    mqttClient.sendMessage('booking', JSON.stringify(booking));
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
}

const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(bookingID);
    if (!booking) return res.status(404).json({ 'message': 'Booking not found' });
    mqttClient.sendMessage('booking', JSON.stringify(booking));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking
};