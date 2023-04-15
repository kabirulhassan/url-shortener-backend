const express = require('express');
const { registerUser, loginUser, getCurrentUser} = require('../controllers/userController');
const auth = require('../middleware/tokenHandler');

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/current', auth, getCurrentUser);


module.exports = router;