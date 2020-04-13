const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = 3000;
const session = require('express-session');

app.use(session({
    secret: 'keyboard cat',
    resave:true,
    saveUninitialized: true
}));

require('dotenv/config');

//Middle use for body parser for postman app
app.use(bodyParser.json());

app.engine( 'hbs', exphbs({
    extname: 'hbs', // configures the extension name to be .hbs instead of .handlebars
    defaultView: 'main', // this is the default value but you may change it to whatever you'd like
    layoutsDir: path.join(__dirname, '/views/layouts'), // Layouts folder
    partialsDir: path.join(__dirname, '/views/partials'), // Partials folder
    
}));

app.set('view engine', 'hbs');

//Import Routes
const recipesRoute = require('./routes/recipes');
app.use('/recipes',recipesRoute);

const profilesRoute = require('./routes/profiles');
app.use('/profile',profilesRoute);

const loginRoute = require('./routes/login');
app.use('/login',loginRoute);

const searchRoute = require('./routes/search'); 
app.use('/search',searchRoute); 

const homeRoute = require('./routes/home'); 
app.use('/', homeRoute); 
app.use('/home', homeRoute); 

app.get("/logout", function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

app.get('/createpost', function(req,res){
    res.render('createpost',{
        profileurl: "/profile/" + req.session.uname,
        isLoggedIn: req.session.isLoggedIn,
        title: "Create a Recipe"
    });
});

app.use(express.static('public'));

//connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,

    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
     () =>{console.log('DB connection successful!');
});

app.listen(port, function() {
    console.log('App listening at port '  + port)
});