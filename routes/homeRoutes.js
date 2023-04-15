const express = require('express');
const Url = require('../models/urlModel');
const { redirectUrl } = require('../controllers/urlController');

const router = express.Router();

router.get('/:shortUrl', redirectUrl);

module.exports = router;
