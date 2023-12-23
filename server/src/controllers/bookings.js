const Booking = require('../models/booking');
const mqttClient = require('../mqtt');
const mongoose = require('mongoose');

const formatDatesInBookings = (unformatedBookings) => {
  return unformatedBookings.map(booking => ({
    ...booking._doc,
    date: booking.date.toISOString().split('T')[0]
  }));
}

const getBookings = async (req, res, next) => {
  try {
    const unformatedBookings = await Booking.find({})
      .sort({ date: 1 });
    const bookings = formatDatesInBookings(unformatedBookings);
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
    const unformatedBooking = await Booking.findById(bookingID)
      .sort({ date: 1 });
    if (!unformatedBooking) return res.status(404).json({ 'message': 'Booking not found' });
    const booking = formatDatesInBookings(unformatedBooking);
    res.json(booking);
  } catch (err) {
    next(err);
  }
}

const getBookingsByDentist = async (req, res, next) => {
  const dentistID = req.params.id;

  if (!dentistID) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  try {
    const unformatedBookings = await Booking.find({ dentistID })
      .sort({ date: 1 });
    if (!unformatedBookings) return res.status(404).json({ 'message': 'Booking not found for this dentist' });
    const bookings = formatDatesInBookings(unformatedBookings);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

const getBookingsByDentistAvailable = async (req, res, next) => {
  const dentistID = req.params.id;
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  if (!dentistID) {
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

    const totalBookings = await Booking.countDocuments(query);
    const totalPages = Math.ceil(totalBookings / limit);

    const unformatedBookings = await Booking.find(query)
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!unformatedBookings) return res.status(404).json({ 'message': 'No available booking found for this dentist' });
    const bookings = formatDatesInBookings(unformatedBookings);
    res.json({ totalPages, bookings });
  } catch (err) {
    next(err);
  }
}

const getBookingsByPatient = async (req, res, next) => {
  const patientID = req.params.id;

  if (!patientID) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  try {
    const unformatedBookingsbookings = await Booking.find({ patientID })
      .sort({ date: 1 });
    if (!unformatedBookingsbookings) return res.status(404).json({ 'message': 'Booking not found for this patient' });
    const bookings = formatDatesInBookings(unformatedBookingsbookings);
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
