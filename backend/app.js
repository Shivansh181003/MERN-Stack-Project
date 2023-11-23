const express = require('express');
const app = express();
const errorMiddleware = require("./middelware/error");
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser())



// import all routes
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');

app.use('/api/v1', product);
app.use('/api/v1', user);


// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app; // export the app