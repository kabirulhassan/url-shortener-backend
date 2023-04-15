const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { validateUserFields } = require("../services/validationService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @description Register a new user
 * @route POST /api/users
 * @param {string} name.body.required - User name
 * @param {string} email.body.required - User email
 * @param {string} password.body.required - User password
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    validateUserFields(name, email, password, res);

    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});
/**
 * @description Login a user
 * @route POST /api/users/login
 * @param {string} email.body.required - User email
 * @param {string} password.body.required - User password
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Email and password are required");
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    name: user.name,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "1d",
            });

        res.status(200).json({ accessToken });

    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});
/**
 * @description Get currently logged in user from the auth token
 * @route GET /api/users/current
 * @access Private
 */
const getCurrentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});


module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
};