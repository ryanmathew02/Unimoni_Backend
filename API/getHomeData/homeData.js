const router = require('express').Router();

const events = require('./../../Model/Event');

require('dotenv').config();

router.get('/getHomeData', async (req, res)=> {
    try {
        const data = await events.find();
        console.log("Success Home Data");
        console.log(data)
        return res.send((data))
    } catch (error) {
        console.log("Failed Home Data");
        res.status(500).json({message:error})
    }
})

module.exports = router;