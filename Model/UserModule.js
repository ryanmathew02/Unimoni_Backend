const mongoose = require('mongoose');

const schema = mongoose.Schema;

const UserModule = new schema({
    Name: String,
    Email: String,
    Password: String,
    PhoneNo: String,
    org: String,
    address: String,
    verified: Boolean,
    googleSign: Boolean,
})

const users = mongoose.model('user',  UserModule);

module.exports = users;