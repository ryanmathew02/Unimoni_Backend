const route = require('express').Router();

const users = require('./../../Model/UserModule');

const jwt = require('jsonwebtoken');


route.post('/google-Signing', async(req, res)=> {
    console.log("check working google sign in api");
    console.log(req);
    var email = req.body.email;
    var name = req.body.name;
    users.find({email})
    .then(result => {
        if(result.length){
            const token = jwt.sign({ 
                    email: email
                }, process.env.SECRETKEY, { 
                    expiresIn: '24h' 
                });
                res.json({
                    code: 200,
                    status: 1,
                    token: token,
                    message: 'Successful Add new user'
                })
        } else {
            const newUser = new users({
                Name: name,
                Email: email,
                Password: null,
                PhoneNo: null,
                org: null,
                address: null,
                verified: true,
                googleSign: true
            })
            newUser.save().then(result => {
                const token = jwt.sign({ 
                    email: email
                }, process.env.SECRETKEY, { 
                    expiresIn: '24h' 
                });
                res.json({
                    code: 200,
                    status: 1,
                    token: token,
                    message: 'Successful Add new user'
                })
            }).catch(err => {
                res.json({
                    status:0,
                    message:"Error while saving the user in database"
                })
            })
        }
    })
    .catch(err => {
        res.json({
            status: 0,
            message: 'Error while validating the already existing if the user'
        })
    })  
})

module.exports = route;
