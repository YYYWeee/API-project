const express = require('express');
const router = express.Router();
const { Booking, Review, Spot, ReviewImage, SpotImage, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// Get all of the Current User's Bookings
// bookings/current
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;
  const bookings = await Booking.findAll({
    attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
    where: {
      userId: user.id,

    },
    include: [
      {
        model: Spot,
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
        include: [
          {
            model: SpotImage,
            attributes: ['url', 'preview']
          }
        ]
      }
    ]
  });
  console.log(bookings);
  let bookingList = [];
  bookings.forEach(booking => {
    bookingList.push(booking.toJSON());
  });
  bookingList.forEach(booking => {
    booking.Spot.SpotImages.forEach(image => {
      if (image.preview === true) {
        booking.Spot.previewImage = image.url;

      }
    })
    if (!booking.Spot.previewImage) {
      booking.Spot.previewImage = null;
    }
    delete booking.Spot.SpotImages;
  })
  res.json({ Bookings: bookingList })


})

// const validateEditBooking = [
//   check('startDate')
//     .exists()
//     .notEmpty()
//     .isDate()
//     .isBefore('endDate')
//     .withMessage('StartDate cannot come after endDate'),
//   check('endDate')
//     .exists()
//     .notEmpty()
//     .isDate()
//     .isAfter('startDate')
//     .withMessage('endDate cannot come before startDate'),
//   handleValidationErrors
// ];



//Edit a Booking
//PUT /bookings/:id
//Body validation errors come from db level(model file)
router.put('/:id', requireAuth, async (req, res, next) => {
  const { startDate, endDate } = req.body;
  const { user } = req;

  let oneBooking = await Booking.findOne({
    where: {
      id: req.params.id
    }
  })
  const oneBookingPOJO = oneBooking.toJSON();
  // console.log(oneBookingPOJO);
  //Redundant work, already define in model file
  //Body validation errors come from db level(model file)
  if (oneBookingPOJO.endDate < oneBookingPOJO.startDate) {
    const err = new Error("endDate cannot come before startDate");
    err.statusCode = 400
    return next(err)
  }

  let currentDate = new Date();

  let newStartDate = new Date(oneBookingPOJO.startDate);

  if (newStartDate < currentDate) {
    const err = new Error("Past bookings can't be modified");
    err.statusCode = 403;
    return next(err)
  }

  if (!oneBooking) {
    res.statusCode = 404
    res.json({ 'message': "Booking couldn't be found" })
  }
  if (oneBooking.userId != user.id) {
    res.statusCode = 403;
    res.json({ 'message': "Forbidden" })
  }

  let setObj = {}
  if (startDate) {
    setObj.startDate = startDate;
  }
  if (endDate) {
    setObj.endDate = endDate;
  }
  oneBooking.set(setObj);
  await oneBooking.save();
  res.json(oneBooking);

})

///delete bookings/:id
//Delete a Booking
router.delete('/:id', requireAuth, async (req, res, next) => {
  const { user } = req;
  const oneBooking = await Booking.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Spot,
        attributes: ['ownerId']
      }
    ]
  });
  let newoneBookingPOJO = oneBooking.toJSON();
  console.log(newoneBookingPOJO)
  if (!oneBooking) {
    const err = new Error("Booking couldn't be found")
    err.statusCode = 404
    return next(err)
  }

  if (newoneBookingPOJO.Spot.ownerId !== user.id && newoneBookingPOJO.userId !== user.id) {
    console.log(newoneBookingPOJO.Spot.ownerId, newoneBookingPOJO.userId)
    const err = new Error('Forbidden')
    err.statusCode = 403
    return next(err)
  }
  let currentDate = new Date();
  let startDate = new Date(newoneBookingPOJO.startDate);
  let endDate = new Date(newoneBookingPOJO.endDate);
  if (startDate < currentDate && endDate > currentDate) {
    res.statusCode = 403;
    return res.json({
      message: "Bookings that have been started can't be deleted."
    })
  }

  await oneBooking.destroy();
  res.json({ "message": "Successfully deleted" })


})

module.exports = router;