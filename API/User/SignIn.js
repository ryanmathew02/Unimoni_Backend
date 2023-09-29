const route = require('express').Router();

const ErrorHandler = require('../../middleware/errorhandler');
const users = require('./../../Model/UserModule');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();


route.post('/signIn',  async (req,res,next)=> {
    email = req.body.email;
    password = req.body.password;
    console.log(email);
    console.log(password);

    if(email!="" && password!=""){
        await users.find({Email:email})
        .then(result => {
            console.log(result);
            if(result.length){
                console.log("Checking Here 12");
                if(result[0].verified){
                    console.log("Here Reached");
                    const hashedPassword = result[0].Password;
                    bcrypt.compare(password, hashedPassword)
                    .then(result => {
                        if(result){
                            console.log("Checking23");
                            console.log(result);
                            const token = jwt.sign({ 
                                email: email
                            }, process.env.SECRETKEY, { 
                                expiresIn: '14h' 
                            });
                            res.json({
                                code: 200,
                                message: 'Login successful',
                                token: token,
                            });
                        }
                        else{
                            return next(new ErrorHandler("User Password Not Correct", 400));
                        }
                    })
                } else{
                    return next(new ErrorHandler("User Not Verified", 400));
                }
            } else {
                return next(new ErrorHandler("User Not Found", 400));
            }
        })
        .catch(error=>{
            return next(new ErrorHandler(error, 400));
        })
    }
})

module.exports = route;