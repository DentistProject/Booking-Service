const express = require('express')
const router = express.Router()
const Booking = require('../models/Booking')

router.post('/v1/bookings', async function (req, res, next) {
    const booking = new Booking(req.body);
  
    try {
      await booking.save();
      res.status(201).json(booking);
    } catch (err) {
     return next(err);
    }
});

module.exports = router;