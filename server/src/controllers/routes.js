const express = require('express')
const router = express.Router()

const  { 
    getBookings,
    getBooking,
    getBookingsByDentist,
    createBooking,
    updateBooking,
    deleteBooking,
    getBookingsByDentistAvailable,
    getBookingsByPatient

} = require('../controllers/bookings.js')

router.get('/v1/bookings', getBookings)
router.get('/v1/bookings/:id', getBooking)
router.get('/v1/bookings/dentist/:id', getBookingsByDentist)
router.get('/v1/bookings/dentist/available/:id', getBookingsByDentistAvailable)
router.get('/v1/bookings/patient/:id', getBookingsByPatient)
router.post('/v1/bookings', createBooking)
router.patch('/v1/bookings/:id', updateBooking)
router.delete('/v1/bookings/:id', deleteBooking)

module.exports = router;