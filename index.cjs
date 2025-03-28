const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db.cjs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS with specific origin
const corsOptions = {
    origin: '*', // Allow all origins (not recommended for production)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
};


app.use(cors(corsOptions));

app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.sendStatus(204);
});

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectToMongo();

// Define routes
app.use('/api/auth', require('./routes/auth.cjs'));
app.use('/api/notes', require('./routes/notes.cjs'));
app.use('/api', require('./routes/login'));

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
