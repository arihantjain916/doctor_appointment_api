const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({

    doctorId:{
        type: mongoose.Schema.ObjectId,
        ref: "Doctor",
        required: [true,"Please provide a doctor id."],
    },

    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true,"Please give user Id scheduling the appointment."]
    },

    serialNumber: {
        type: Number,
        required: [true,"Please provide appointment serial number."]
    },

    appointmentType: {
        type: String,
        enum: ["video","walkin"],
        required: [true,"Please provide appointment type from video or walkin only."]
    },

    dates:{

        createdAt: {
            type: Date,
            default: Date.now,
        },

        shift: {
            type: String,
            enum: ["morning","evening"],
            required: [true,"Provide a shift for appointment."]
            
        },

        forDate: {
            type: Date,
            required: [true,"Provide a date for which appointment has to be booked."]
        },

        rescheduled: {
            at: {
                type: Date,
                default: Date.now,
            },

            for: {
                type: Date,
            },
        },

        consultationStartedAt: {
            type: Date,
        },
        
        consultationCompletedAt: {
            type: Date,
        },

        nextAppointment: {
            type: Date,
        },
    },

    paymentDetails:{

        _id: true,

        mode: {
            required: [true,"Please provide payment mode from online and cash."],
            type: String,
            enum: ["online","cash"],
        },

        completedOn: {
            type: Date
        },

        status: {
            type: String,
            enum: ["pending","paid"],
            default: "pending",
        },

        amount: {
            type: Number,
            required: [true,"Appointment amount required."]
        },

        // onlinePaymentDetails: {

        // },

    },

    note: {
        type: String,
    },

    status: {
        type: String,
        enum: ["confirmed","completed","rescheduled","cancelled","ongoing"],
        default: "confirmed",
    },

    supportingDocuments: [
        {
            _id: false,
            description: {
                type:String,
            },
            publicId: {
                type: String,
                required: [true,"Please provide public id for document image."],
            },
            secureUrl: {
                type: String,
                required: [true,"Please provide secure url for document."]
            },
        },
    ],

    prescriptionImages: [
        {
        _id: false,
            publicId: {
                type: String,
                required: [true,"Please provide public id for document image."],
            },
            secureUrl: {
                type: String,
                required: [true,"Please provide secure url for document."]
            },
        },
    ],

});


module.exports = mongoose.model("Appointment",appointmentSchema);