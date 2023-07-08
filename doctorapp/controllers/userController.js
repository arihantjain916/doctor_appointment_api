const fast2sms = require("fast-two-sms");
const crypto = require("crypto");


const BigPromise = require("../middlewares/bigPromise");

const User = require("../models/user");
const CustomError = require("../utils/CustomError");
const {sendOtp} = require("../utils/sendOtp");
const user = require("../models/user");

exports.isRegistered = BigPromise(async (req,res,next)=>{

    const {phoneNumber} = req.body;

    const user = await User.findOne({phoneNumber});

    if(!user){
        res.status(400).json({
            success: false,
            message: "User not registered."
        })
    }
    else{
        res.status(200).json({
            success: true,
            message: "User is registered."
        });
    }
});

exports.registerUser = BigPromise(async (req,res,next)=>{

    const {phoneNumber,name,age,gender} = req.body;

    const user = await User.create({
        name,
        phoneNumber,
        age,
        gender
    });

    const otp = await user.generateOtp();

    sendOtp(phoneNumber,otp,res);
});


exports.resendOtp = BigPromise(async (req,res,next)=>{

    const {phoneNumber} = req.body;

    if(!phoneNumber){
        return next(new CustomError("Please provide a phone number."),400);
    }

    const user = await User.findOne({phoneNumber});

    if(!user){
        return next(new CustomError("User with this phone number is not registered."),400);
    }

    const otp = await user.generateOtp();

    sendOtp(phoneNumber,otp,res);
});


exports.verifyOtp = BigPromise(async (req,res,next)=>{

    const {phoneNumber,otp} = req.body;

    const user = await User.findOne({phoneNumber});

    if(!user){
        return next(new CustomError("User with this mobile number not registered."),400);
    }

    const encryptedOtp = await crypto.createHash('sha256').update(otp).digest('hex');

    if(!user.phoneOtp === encryptedOtp){
        return next(new CustomError("Incorrect OTP."),400);
    }

    if(user.phoneOtpExpiry < Date.now()){
        return next(new CustomError("OTP Expired"),400);
    }

    const token = await user.getJwtToken();

    user.phoneOtp = user.phoneOtpExpiry = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "OTP is correct",
        token
    })
});


exports.userDetails = BigPromise(async (req,res,next)=>{

    const user = req.user;

    const userData = {
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email,
        gender: user.gender,
        address: user.address,
        age: user.age,
        dependents: user.dependents,
    }

    res.status(200).json({
        success: true,
        message: "User Details are fetched.",
        user: userData
    })
});




