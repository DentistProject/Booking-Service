const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') })
//variables
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/BookingDB';
const port = process.env.PORT || 8081;
// Connect to MongoDB
mongoose.connect(mongoURI).catch(function (err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
});

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())


app.listen(port, function (err) {
    if (err) throw err;
    console.log(`Express server listening on port ${port}`);
    console.log(`Backend: http://localhost:${port}/api/`);
});