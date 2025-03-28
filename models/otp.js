const mongoose = require('mongoose')
const { Schema } = mongoose;


const otpSchema = new Schema({

    otp: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },

})

module.exports = mongoose.model('otp', otpSchema);