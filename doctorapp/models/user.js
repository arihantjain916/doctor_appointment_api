const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: [true, "Please provide a Name."],
        maxlength: [40,"Name should not exceed 40 characters."],
    },

    phoneNumber:{
        type: Number,
        unique: [true,"Mobile number already registered."],
        required: [true,"Please provide a mobile number."],
        max: [9999999999,"Please enter a valid phone number."],
        min: [6000000000,"Please enter a valid phone number."],
        index: true,
    },

    email: {
        type: String,
        unique: [true,"Email Id already exists"],
        validate: [validator.isEmail,"Please enter a valid email address."],
        sparse: true,
    },

    address:{
        line1:{
            type: String,
            maxlength: [250,"Maximum 250 characters are allowed in address line 1."],
            minlength: [10,"Please provide a minimum of 10 characters in address line 1."]
        },
        line2: {
            type: String,
            maxlength: [250,"Maximum 250 characters are allowed in address line 2."],
        },

        city: {
            type: String,
            minlength: [3,"Please provide a city."],
        },
        state: {
            type: String,
            minlength: [3,"Please provide a state"],
        },
        pincode: {
            type: Number,
            minlength: [6,"Pincode should be 6 digits long."],
            maxlength: [6,"Pincode should be 6 digits long."],
        }
    },

    physicalDetails:{
        age:{
            type: Number,
            required: [true, "Please provide age of the patient."],
            min: 0,
            max: 150,
        },
        gender: {
            type: String,
            required: [true,"Please provide a gender of the patient."],
            enum: ["male","female","don't want to disclose"]
        },
        height: {
            type: Number,
        },
        weight:{
            type: Number,
        }
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    role:{
        type: String,
        default: "user",
    },

    phoneOtp: {
        type: String,
    },

    phoneOtpExpiry:{
        type: Date,
    },

    dependents:[
         {
            _id: false,
             name: {
                type: String,
                required: [true, "Please provide a Name."],
                maxlength: [40,"Name should not exceed 40 characters."],
             },
             relationship: {
                 type: String,
                 enum: ["spouse","mother","father","son","daughter","sister","brother"],
             },
             age: {
                type: Number,
                required: [true, "Please provide age of the patient."],
                min: 0,
                max: 150,
             },
             gender: {
                type: String,
                required: [true,"Please provide a gender of the patient."],
                enum: ["male","female","don't want to disclose"],
             }
         }
    ],

    appointments: [
        {
            appointmentId: {
                type: mongoose.Schema.ObjectId,
                ref: "Appointment",
                required: true,
            }
        }
    ]

});

userSchema.methods.getJwtToken = async function(){

    const token = await jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_TOKEN_EXPIRY});
    return token;
}

userSchema.methods.generateOtp = async function(){

    const otp = Math.floor(1000 + Math.random() * 10000).toString();

    this.phoneOtp = await crypto.createHash('sha256').update(otp).digest("hex");

    this.phoneOtpExpiry = Date.now() + (5 * 60 * 1000);

    await this.save();
    
    return otp;
}

module.exports = mongoose.model("User",userSchema);