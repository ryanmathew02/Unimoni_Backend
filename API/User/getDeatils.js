const route = require('express').Router();

const users = require('./../../Model/UserModule');

const jwt = require('jsonwebtoken');


module.exports.getDetails = async (req,res) => {
    console.log("check getDetails api");
    console.log(req.email);
    await users.find({Email:req.email})
    .then( result => {
        console.log(result);
        if(result.length){
            res.json(result);
        }
    })
    .catch(err => {
        console.log('Failed while checking from user');
        res.json({
            status: 0,
            message: 'Failed while checking from user'
        })
    })
};