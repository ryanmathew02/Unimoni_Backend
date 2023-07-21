require('./Connection/connectDB');

const app = require('express')();
const PORT = process.env.PORT || 5000;
const path = require('path');
const bodyparser = require('body-parser');
const cors = require('cors')


// allow to fetch data from the request
app.use(bodyparser.json());
app.use(bodyparser.urlencoded( {extended: true} ));
app.use(cors({
    origin: "http://localhost:3000"
}));

//API's
const signUp = require('./API/User/SignUp');
const HomeData = require('./API/getHomeData/homeData');



//connecting API's
app.use('/home', HomeData);
app.use('/user',signUp);
app.use('/', (req, res)=>{
    res.sendFile(path.join(__dirname+"/views/homepage.html"));
})


app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
})