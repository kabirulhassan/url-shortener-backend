
const validateUserFields = (name, email, password, res) => {
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Name, email and password are required");
    }
}

module.exports = {
    validateUserFields,
}