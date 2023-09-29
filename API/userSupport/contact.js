const { response } = require('express');
const UserSupport = require('../../Model/UserSupport');
const ErrorHandler = require('../../middleware/errorhandler');


const route = require('express').Router();
require('dotenv').config();




route.post('/support', (req, res, next) => {
    userEmail = req.body.email;
    username = req.body.name;
    message = req.body.message;
    subject = req.body.subject;

    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userEmail) && username != "" && message != "" && subject != "") {
        const newSupport = new UserSupport({
            userEmail: userEmail,
            name: username,
            message: message,
            Subject: subject,
        });

        newSupport.save()
            .then(response => {
                res.send(response)
            })
            .catch(error => {
                return next(new ErrorHandler(error, 400));
            })

    } else {
        return next(new ErrorHandler("Some Field are empty or Invalid", 400));
    }

})





module.exports = route;