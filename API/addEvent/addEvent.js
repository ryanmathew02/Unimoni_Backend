const express = require('express');
const Event = require('../../Model/Event');
const router = express.Router();


router.post('/new', (req,res) => {
    console.log(req.email);
    const ename = req.body.ename;
    const location = req.body.eloct;
    const artist = req.body.eartist;
    const date = req.body.edate;
    const startime = req.body.estime;
    const endtime = req.body.eetime;
    const avail = req.body.eavail;
    const active = req.body.eactive;

    const newEvent = new Event({
        Name: ename,
        Location: location,
        Artist: artist,
        date: date,
        startTime: startime,
        endTime: endtime,
        available: avail,
        active: active
    })

    newEvent.save()
    .then(response => {
        res.send(response);
    })
    .catch(error => {
        res.send(error);
    })

})

module.exports = router;