const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function(req, res, next){
    const token = req.header('auth-token');
    if(!token) res.status(400).send('Access denied!');

    try {
        const verified = jwt.verify(`${token}`, process.env.TOKEN_SECRET || config.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch(err) {
        res.status(400).send('Invalid Token!');
    }
}