const route = require('express').Router();

const users = require('./../../Model/UserModule');

const bcrypt = require('bcrypt');

require('dotenv').config();

const {v4:uuidv4} = require('uuid');

const nodemailer = require("nodemailer");

const userVerification = require('./../../Model/UserVerification');




let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.AUTH_PASS,
    }
})
transporter.verify((error, success) => {
    if(error) {
        console.log(error);
    } else {
        console.log("ready for messages");
        console.log(success);

    }
})

const sendVerificationEmail = ({_id, Email}, res) => {

    const currentUrl = "http://localhost:5000/";
    const uniqueString = uuidv4() + _id;

    const mailOption = {
        from: process.env.AUTH_EMAIL,
        to: Email,
        subject: "Verify your Email",
        html: `<p>Verify your email address to complete the signup and login into your account.</p><p>This Link <b>expires in 6 hours</b>.</p><p>Press <a href=${currentUrl + "user/auth/verify/" + _id + "/" + uniqueString}>here</a> to proceed.</p>`
    }

    const rounds = 15;

    bcrypt.hash(uniqueString, rounds).then(hashUniqueString => {

        const newUserVerification = new userVerification({
                userId: _id,
                uniqueString: hashUniqueString,
                createdAt: Date.now(),
                expiresAt: Date.now() + 21600000
        });

        newUserVerification.save().then( () => {
            transporter.sendMail(mailOption).then( () => {
                res.status(200).json({
                    status: "Pending",
                    message: "Verification Mail sent"
                });
            }).catch(err => {
                res.json({
                    status: 0,
                    message: "Verification email failed"
                });
            })
        }).catch(err => {
            res.json({
                status: 0,
                message: "Error while saving the Verification"
            })
        }) 
    }).catch(err => {
        res.json({
            status: 0,
            message: "Error while hashing the Verification code"
        })
    })
}

route.post('/signUp', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;

    console.log("Checking 1");
    if(name == " " || email == " " || password == " "){
        res.json({
            status: 0,
            message: "One of the Field is Empty"
        });
    } else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status: 0,
            message: "Invalid Email Address type"
        });
    } else if(password.lenght < 8 ){
        res.json({
            status: 0,
            message: "Password Length Should be larger than 8"
        })
    } else {
        await users.find({email}).then(result => {
            if(result.length){
                res.json({
                    status: 0,
                    message: "The user with this Email Already Exist"
                });
            } else {
                const rounds = 15;
                bcrypt.hash(password,rounds).then(hashPassword => {
                    const newUser = new users({
                        Name: name,
                        Email: email,
                        Password: hashPassword,
                        PhoneNo: phone,
                        verified: false
                    })

                    newUser.save().then(result => {
                        sendVerificationEmail(result,res);
                    }).catch(err => {
                        res.json({
                            status:0,
                            message:"Error while saving the user in database"
                        })
                    })
                }).catch(err => {
                    res.json({
                        status: 0,
                        message: "Error while hashing the password"
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: 0,
                message: "Error while Check whether the user already exist or not"
            })
        })
    }
})

route.get("/auth/verify/:Id/:uniqueString", (req, res) => {

    const Id = req.params.Id;
    const uniqueString = req.params.uniqueString;
    console.log("_id in users collections: " + Id);
    console.log("uniqueString: " + uniqueString);
    userVerification
        .find({userId:Id})
        .then( (result) => {
            console.log("Result to find(verify) " + result);
            if(result) {
                // user verification record exist so we proceed
                const expiresAt = result[0].expiresAt;
                const hashedUniqueString = result[0].uniqueString;

                //checking for expired unique string
                if(expiresAt < Date.now()){
                    // record has been expired so we delete
                    userVerification
                        .deleteOne({Id})
                        .then( result => {
                            users
                                .deleteOne({_id: Id})
                                .then( () => {
                                    let message = "Link has expired. Please sign up again";
                                    res.redirect(`/user/verified/error=true&message=${message}`);
                                })
                                .catch( error => {
                                    let message = "Clearing user with expired ubique string failed";
                                    res.redirect(`/user/verified/error=true&message=${message}`);
                                })
                        })
                        .catch((error) => {
                            let message = "An error occured while clearing expired user verification";
                            res.redirect(`/user/verified/error=true&message=${message}`);
                        })
                } else {
                    //valid record exist so we validate the user string
                    // first compare the hashed value of unique string
                    bcrypt.compare(uniqueString, hashedUniqueString)
                        .then(result => {
                            if(result) {
                                // string  matches
                                users.updateOne({_id: Id}, {verified: true})
                                .then(() => {
                                    userVerification.deleteOne({Id})
                                    .then(() => {
                                        res.sendFile(path.join(__dirname, "./../../views/verified.html"));
                                    })
                                    .catch(error => {
                                        let message = "An error occured while finalizing successful verification";
                                        res.redirect(`/user/verified/error=true&message=${message}`);
                                    })
                                })
                                .catch(error => {
                                    let message = "An error occured while updating the user verified true";
                                    res.redirect(`/user/verified/error=true&message=${message}`);
                                })

                            } else {
                                // existing record but incorrect verification details passed.
                                let message = "Invalid Verification details passed. check your inbox";
                                res.redirect(`/user/verified/error=true&message=${message}`);
                            }
                        })
                        .catch( error => {
                            let message = "An error occured while comparing the unique string";
                            res.redirect(`/user/verified/error=true&message=${message}`);
                        })
                }


            } else {
                // user verification record doesn't exist
                let message = "Account record doesn;t exist or has been verifed already. please sign up or login in.";
                res.redirect(`/user/verified/error=true&message=${message}`);   
            }
        })
        .catch((error) => {
            console.log(error);
            let message = "An error occured while checking for the existing user verification record";
            res.redirect(`/user/verified/error=true&message=${message}`);
        })

})


module.exports = route;