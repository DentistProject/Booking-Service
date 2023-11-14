const Booking = require('../models/booking');
const mqttClient = require('../mqtt');

const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find();
    mqttClient.sendMessage('bookingTopic', 'bookings fetched');
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).send();
    mqttClient.sendMessage('bookingTopic', 'booking fetched');
    res.json(booking);
  } catch (err) {
    next(err);
  }
}

const createBooking = async (req, res, next) => {
  const booking = new Booking(req.body);

  try {
    await booking.save();
    mqttClient.sendMessage(req.body.message);
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
    booking.status = req.body.status || booking.status;
    booking.date = req.body.date || booking.date;
    booking.time = req.body.time || booking.time;
    booking.message = req.body.message || booking.message;

    await booking.save();
    mqttClient.sendMessage('bookingTopic', 'booking updated');
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
}

const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).send();
    mqttClient.sendMessage('bookingTopic', 'booking deleted');
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