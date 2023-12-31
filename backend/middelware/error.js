const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    // Handle wrong mongoose object ID error
    if(err.name === 'CastError'){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Handle mongoose validation error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(value => value.message);
        err = new ErrorHandler(message, 400);
    }

    // Handle mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    // Handle wrong JWT error
    if(err.name === 'JsonWebTokenError'){
        const message = 'JSON Web Token is invalid. Try Again!!!';
        err = new ErrorHandler(message, 400);
    }

    // Handle expired JWT error
    if(err.name === 'TokenExpiredError'){
        const message = 'JSON Web Token is expired. Try Again!!!';
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};