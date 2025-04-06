class AppError extends Error {
    constructor(message, statusCode) {
        super(message); // Call the parent class constructor
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // 'fail' for 4xx, 'error' for 5xx
        this.isOperational = true; // Mark as an operational error (not a programming error)

        Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
}

module.exports = AppError;