const asyncHandler = require("express-async-handler");
const Url = require("../models/urlModel");
const UAParser = require('ua-parser-js');
/**
 * @desc Shorten a url(uses shortid to generate a unique short url),
 * if the url already exists in the database, it returns the existing url,
 * if user is logged in, it saves the url with user_id
 * @route POST /api/shorten
 * @access Public
 */
const shortenUrl = asyncHandler( async (req, res) => {
    const longUrl = req.body.longUrl;
    console.log('User', req.user);
    const user_id = (req.user?.id || 'public').toString();
    console.log('user_id', user_id);

    const foundUrl = await Url.findOne({ longUrl, user_id });
    if (foundUrl) {
        console.log('foundUrl', foundUrl);
        res.json(foundUrl);
    } else {
        const createdUrl = await Url.create({ longUrl, user_id });
        console.log('createdUrl', createdUrl);
        res.json(createdUrl);
    }
});
/**
 * @desc Redirects to the long url
 * @route GET /:shortUrl
 * @access Public
 */
const redirectUrl = asyncHandler( async (req, res) => {
    const shortUrl = req.params.shortUrl;
    console.log('shortUrl', shortUrl);

    const foundUrl = await Url.findOne({ shortUrl });
    if (foundUrl) {
        const parser = new UAParser();
        const ua = req.headers['user-agent'];
        const browserName = parser.setUA(ua).getBrowser().name || 'Others';
        foundUrl.clicks++;
        const browser = foundUrl.browser.find(b => b.browserName === browserName);
        if (browser) {
            browser.clicks++;
        } else {
            foundUrl.browser.push({ browserName, clicks: 1 });
        }
        await foundUrl.save();
        res.redirect(foundUrl.longUrl);
    } else {
        res.status(404);
        throw new Error("Url not found");
    }
});


/**
 * @desc Analytics of all the urls for a user
 * @route GET /api/analytics
 * @access Private
 * @returns {Array} Array of urls
 */
const getAnalytics = asyncHandler( async (req, res) => {
    if(!req.user) {
        res.status(403);
        throw new Error("Forbidden access, user must be logged in");
    }
    const user_id = req.user.id.toString();
    if(user_id) {
        Url.find({ user_id }).then(urls => {
            res.json(urls);
        }).catch(err => {
            res.status(500);
            throw new Error("Internal server error");
        });
    }else{
        res.status(401);
        throw new Error("Unauthorized access");
    }
});

module.exports = {
    shortenUrl,
    redirectUrl,
    getAnalytics
}