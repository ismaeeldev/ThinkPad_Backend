const express = require('express');
var cors = require('cors')
const connectToMongo = require('./db.cjs');
require('dotenv').config()

const app = express();
const port = process.env.PORT;

app.use(express.json());

//Cors policy Error ......
app.use(cors())
app.use(express.json())


// Connect to MongoDB
connectToMongo();



// Define routes
app.use('/api/auth', require('./routes/auth.cjs'));
app.use('/api/notes', require('./routes/notes.cjs'));


app.get('/', (req, res) => {
    res.send('Hello World! of Thinkpad Backend ')
})

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
    console.log(`ThinkPad listening on port ${port}`);
});
