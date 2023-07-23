require('./Connection/connectDB');

const { error } = require('./middleware/error');
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
const addEvent = require('./API/addEvent/addEvent');
const signIn = require('./API/User/SignIn');


//connecting API's
app.use('/event', addEvent);
app.use('/home', HomeData);
app.use('/user',signUp);
app.use('/users',signIn);
app.use('/', (req, res)=>{
    res.sendFile(path.join(__dirname+"/views/homepage.html"));
})

app.use(error)
app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
})