const mongoose = require('mongoose')
const { Schema } = mongoose;


const fbSchema = new Schema({

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },

})

module.exports = mongoose.model('fb', fbSchema);