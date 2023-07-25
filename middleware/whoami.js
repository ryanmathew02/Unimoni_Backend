const jwt = require('jsonwebtoken');
const ErrorHandler = require("./errorhandler");


module.exports.whoami = (async (req, res, next) => {
    const { token } = req.body;
    console.log(token);
    if (!token) {
        return next(new ErrorHandler("Token not found", 400));
    }

    const decoded = jwt.verify(token, process.env.SECRETKEY);

    if(!decoded){
        res.json({
            code: 401,
            message: 'Token expired or invalid',
        });
    }

    res.json({
        code: 200,
        message: 'user verified',
        email: decoded.email
    });
});