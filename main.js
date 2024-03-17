require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

const PORT = process.env.PORT || 4000;
//db connection
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;

db.on('error',(error)=>{
    console.log("DB error : ", error);
})
db.once('open',()=>{
    console.log("Connected to database");
    
});

//middlewares

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use(session({
    secret : "My secret key",
    saveUninitialized : true,
    resave : false
}));

app.use((req,res,next)=>{
    res.locals.message = req.session.message
    delete req.session.message;
    next()
})

app.use(express.static('uploads'));

//set template engine
app.set('view engine' , "ejs");

//route prefix

app.use(require('./routes/routes'))

app.listen(PORT,()=>{
    console.log("Server listening");
})