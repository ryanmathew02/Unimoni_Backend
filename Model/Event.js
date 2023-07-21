const mongoose = require('mongoose');

const schema = mongoose.Schema;

const EventsSchema = new schema({
    Name: String,
    Location: String,
    Artist: [String],
    date: Date,
    startTime: Date,
    endTime: Date,
    available: Number,
})

const Event = mongoose.model('events', EventsSchema);

module.exports = Event;