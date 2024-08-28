const mongoose = require('mongoose')
require('dotenv').config()

const URI = process.env.MONGO_URL;




const connectToMongo = async () => {
    try {
        await mongoose.connect(URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

module.exports = connectToMongo;
