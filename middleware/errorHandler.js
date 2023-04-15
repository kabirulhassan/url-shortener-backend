const { errorConstants } = require("../constants/errorConstants");
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    console.log("Error: " + err.message);
    let title = "";
    switch (statusCode) {
        case errorConstants.BAD_REQUEST:
            title = "Bad Request";
            break;
        case errorConstants.UNAUTHORIZED:
            title = "Unauthorized";
            break;
        case errorConstants.FORBIDDEN:
            title = "Forbidden";
            break;
        case errorConstants.NOT_FOUND:
            title = "Not Found";
            break;
        case errorConstants.INTERNAL_SERVER_ERROR:
            title = "Internal Server Error";
            break;
        default:
            title = "No Error";
    }
    res.status(statusCode);
    if (Object.values(errorConstants).includes(statusCode)) {
        res.json({
            title: title,
            message: err.message,
            stackTrace: process.env.NODE_ENV == "production" ? null : err.stack,
        });
    } else {
        console.log("No Error");
    }
};

module.exports = errorHandler;
