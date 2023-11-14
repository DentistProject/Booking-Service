const express = require('express')
const router = express.Router()

const  { 
    getBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking 
} = require('../controllers/bookings.js')

router.get('/v1/bookings', getBookings)
router.get('/v1/bookings/:id', getBooking)
router.post('/v1/bookings', createBooking)
router.patch('/v1/bookings/:id', updateBooking)
router.delete('/v1/bookings/:id', deleteBooking)

module.exports = router;