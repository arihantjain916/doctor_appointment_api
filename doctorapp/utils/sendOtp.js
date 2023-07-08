const fast2sms = require("fast-two-sms");

exports.sendOtp = async function(phoneNumber,otp,res){

    let numbers = [phoneNumber];

    const message = `${process.env.OTP_MESSAGE} ${otp}`

    const response = await fast2sms.sendMessage({
        authorization: process.env.FAST2SMS_API_KEY,
        message,
        numbers,
    });

    res.status(200).json({
        success: response.return,
        message: response.message.toString(),
    });

}

