const BigPromise = require("../middlewares/bigPromise");
const Appointment = require("../models/appointment");

const User = require("../models/user");
const CustomError = require("../utils/CustomError");

exports.home = BigPromise(async (req, res, next) => {
  const user = req.user;

  if (user) {
    if (user.height)
      res.status(200).json({
        name: user.name,
        upcomingAppointment: user.appointment[0],
        height: user.physicalDetails.height,
        weight: user.physicalDetails.weight,
      });
  }

  return next(new CustomError("Please login to access this route."), 400);
});

exports.bookAppointment = BigPromise(async (req, res, next) => {
  const user = req.user;
  const { doctorId, shift, appointmentType, forDate, paymentDetails, amount } =
    req.body;

  //TODO:
  const doctor = Doctor.findById(doctorId);
  let serialNumber;

  if (doctor) {
    serialNumber = Doctor.findById(doctorId).populate("serialNumber");
  } else {
    return next(
      new CustomError("Doctor not found to book an appointment."),
      400
    );
  }

  const appointment = await Appointment.create({
    doctorId,
    userId: user._id,
    serialNumber,
    appointmentType,
    dates: {
      forDate,
      shift,
    },
    paymentDetails,
  });

  if (appointment) {
    res.status(200).json({
      success: true,
      message: "Appointment booked successfully...",
      appointment,
    });
  } else {
    return next(
      new CustomError(
        "Some error occured while booking appointment please try again."
      ),
      400
    );
  }
});
