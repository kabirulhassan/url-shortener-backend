const express = require('express');
const Url = require('../models/urlModel');
const { shortenUrl } = require('../controllers/urlController');
const auth = require('../middleware/tokenHandler');

const router = express.Router();

router.post('/',auth,shortenUrl);


module.exports = router;
