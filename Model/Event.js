const mongoose = require('mongoose');

const schema = mongoose.Schema;

const EventsSchema = new schema({
    Name: {
        type: String,
        required: true
    },
    Location: {
        type: String,
        required: true
    },
    Artist: [{
        name: String,
        img: String,
    }],
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    available: {
        type: Number,
        required: true
    },
    active: Boolean,
})

const Event = mongoose.model('events', EventsSchema);

module.exports = Event;