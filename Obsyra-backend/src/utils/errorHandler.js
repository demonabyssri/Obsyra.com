const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    console.error(`ERROR ${statusCode}:`, err.stack || err); 

    res.status(statusCode).json({
        status: 'error',
        message: message,
    });
};

module.exports = errorHandler;