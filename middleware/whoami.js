const jwt = require('jsonwebtoken');
const ErrorHandler = require("./errorhandler");
const { catchAsyncError } = require('./createAsyncError');



module.exports.whoami = catchAsyncError(async (req, res, next) => {
    const { token } = req.body;
    console.log(token);
    if (!token) {
        // return next(new ErrorHandler("Token not found", 400));
        res.json({
            code: 404,
            status: "Failed Token",
            message: "Token Expired" 
        })
    }

    const decoded = jwt.verify(token, process.env.SECRETKEY);

    if(!decoded){
        res.json({
            code: 401,
            status: "Failed Token",
            message: 'Token expired or invalid',
        });
    }

    res.json({
        code: 200,
        status: "Success Token",
        message: 'user verified',
        email: decoded.email
    });
});