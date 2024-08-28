const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db.cjs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS with specific origin
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to match your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Set to true if your request requires credentials like cookies, HTTP authentication or client-side SSL certificates
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectToMongo();

// Define routes
app.use('/api/auth', require('./routes/auth.cjs'));
app.use('/api/notes', require('./routes/notes.cjs'));

// Home route
app.get('/', (req, res) => {
    res.send('Hello World! from Thinkpad Backend');
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send('Route not found');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
    console.log(`ThinkPad backend listening on port ${port}`);
});
