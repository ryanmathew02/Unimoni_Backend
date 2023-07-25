const mongoose = require('mongoose');

const schema = mongoose.Schema;


const userSupport = new schema({
    userEmail: String,
    name: String,
    message: String,
    Subject: String
});

const UserSupport = mongoose.model('userSupport',  userSupport);

module.exports = UserSupport;