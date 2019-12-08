const express = require('express');
const bodyParser = require("body-parser");
const User = require('./BABuser.js');
const Data = require('./BABTime.js');


const app = express();
const login = require('./login.js')(app,User);
const BAB = require('./BABData.js')(app,Data);//

const mongoose = require('mongoose');
const db=mongoose.connection;

db.on('error',console.log.bind(console,"connection error"));
db.once('open',function(){
    console.log("connection succeeded");
})
mongoose.connect ("mongodb://localhost/newbieProject", { useNewUrlParser: true })



app.use(express.static('public/views'));
app.use(express.static('public/lib'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);

const server = app.listen(7000, () => {
    console.log('server is running at port 7000');
});
