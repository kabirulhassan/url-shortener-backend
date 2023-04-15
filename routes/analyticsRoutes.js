const express = require('express');
const { getAnalytics } = require('../controllers/urlController');
const auth = require('../middleware/tokenHandler');

const router = express.Router();

router.get('/', auth, getAnalytics);

module.exports = router;