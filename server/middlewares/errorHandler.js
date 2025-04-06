const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
    // Set default values for error properties
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Send a custom error response
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message || 'Something went wrong!'
    });
};

module.exports = errorHandler;