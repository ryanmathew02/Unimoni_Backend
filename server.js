require('./Connection/connectDB');

const app = require('express')();
const PORT = process.env.PORT || 5000;
const path = require('path');
const bodyparser = require('body-parser');


// allow to fetch data from the request
app.use(bodyparser.json());
app.use(bodyparser.urlencoded( {extended: true} ));


//API's
const signUp = require('./API/User/SignUp');



//connecting API's
app.use('/user',signUp);
app.use('/', (req, res)=>{
    res.sendFile(path.join(__dirname+"/views/homepage.html"));
})


app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
})