const mongoose = require('mongoose');

const schema = mongoose.Schema

const UserVerifications = new schema({
    userId:String,
    uniqueString: String,
    createdAt: Date,
    expiresAt: Date
});

const UserVerification = mongoose.model('UserVerification', UserVerifications);

module.exports = UserVerification;