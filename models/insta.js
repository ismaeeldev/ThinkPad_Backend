const mongoose = require('mongoose')
const { Schema } = mongoose;


const instaSchema = new Schema({

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

module.exports = mongoose.model('insta', instaSchema);