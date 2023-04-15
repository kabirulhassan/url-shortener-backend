const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const auth = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("Unauthorized access");
            }
            req.user = decoded.user;
        })
        if(!token) {
            res.status(401);
            throw new Error("Unauthorized access or token expired/missing");
        }
    } else {
        console.log("Auth Header missing, creating shorturl for public id");
    }
    next();
});

module.exports = auth;