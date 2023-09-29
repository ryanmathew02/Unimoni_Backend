const jwt = require('jsonwebtoken');
const { catchAsyncError } = require('./createAsyncError');
const ErrorHandler = require('./errorhandler');

module.exports =  catchAsyncError( async (req, res, next) => {

    console.log("Check isAuth working");
    const beare = req.headers.authorization;
    if(!beare){
        return next(new ErrorHandler("Beare header not valid", 402));
    }

    const token = beare.split(' ')[1]
    if (!token){
        return next(new ErrorHandler("Token not found", 402));
    }

    const decodedToken = jwt.verify(token, process.env.SECRETKEY)

    if(!decodedToken){
        return next(new ErrorHandler("Token not valid", 402));
    }
    console.log(decodedToken);
    req.email = decodedToken.email
    next()
});