const Booking = require('../models/booking');
const mqttClient = require('../mqtt');
const mongoose = require('mongoose');

const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

const getBooking = async (req, res, next) => {
  const bookingID = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(bookingID)) {
    return res.status(400).json({ message: 'Invalid id' });
  }
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
  
  if (!dentistID){
    return res.status(400).json({ message: 'Invalid id' });
  }

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

  if (!dentistID){
    return res.status(400).json({ message: 'Invalid id' });
  }

  try {
    const query = { dentistID, status: 'AVAILABLE' };
    const dateFilter = req.query.dateFilter;

    if (dateFilter === '2weeks') {
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
      query.date = { $lte: twoWeeksFromNow };
    } else if (dateFilter === '1month') {
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setDate(oneMonthFromNow.getDate() + 30);
      query.date = { $lte: oneMonthFromNow };
    } else if (dateFilter === '3months') {
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setDate(threeMonthsFromNow.getDate() + 90);
      query.date = { $lte: threeMonthsFromNow };
    }


    const bookings = await Booking.find(query);
    if (!bookings) return res.status(404).json({ 'message': 'No available booking found for this dentist' });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

const getBookingsByPatient = async (req, res, next) => {
  const patientID = req.params.id;
  
  if (!patientID){
    return res.status(400).json({ message: 'Invalid id' });
  }
  
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
  const bookingID = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(bookingID)) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  try {
    const booking = await Booking.findById(bookingID);

    if (!booking) return res.status(404).json({ 'message': 'Booking not found' });

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
  const bookingID = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(bookingID)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

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
  getBookingsByDentistAvailable,
  getBookingsByPatient,
  getBookingsByDentist,
  createBooking,
  updateBooking,
  deleteBooking,
};
