const asyncHandler = require("express-async-handler");
const Url = require("../models/urlModel");
const UAParser = require('ua-parser-js');

const shortenUrl = asyncHandler( async (req, res) => {
    const longUrl = req.body.longUrl;
    console.log('User', req.user);
    const user_id = (req.user.id || 'public').toString();
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

module.exports = {
    shortenUrl,
    redirectUrl
}