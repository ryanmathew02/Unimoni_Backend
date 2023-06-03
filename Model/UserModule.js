const mongoose = require('mongoose');

const schema = mongoose.Schema;

const UserModule = new schema({
    Name: String,
    Email: String,
    Password: String,
    PhoneNo: String,
    verified: Boolean
})

const users = mongoose.model('user',  UserModule);

module.exports = users;