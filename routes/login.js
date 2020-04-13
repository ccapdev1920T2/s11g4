const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const assert = require('assert');
const mongoose = require('mongoose');
const url = 'mongodb+srv://recipy:pass123@recipydb-nzcto.mongodb.net/test?retryWrites=true&w=majority';
const bcrypt = require('bcryptjs');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');

// passport config
require('../config/passport')(passport);

// database config
const db =require('../config/database').database;

// connect to mongo
mongoose.connect(db,{useNewUrlParser: true,useUnifiedTopology: true })
    .then(() => console.log('Mongo DB connected!'))
    .catch(err => console.log(err));

router.use(bodyParser.urlencoded({ extended: true }));

// multer to accept images
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/img/');
    },
    filename: function(req, file, cb) {
        cb(null, filename = Date.now() + file.originalname);
    }
});

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024*1024*5
    }
});

// express session middleware
router.use(session({
    secret: 'keyboard cat',
    saveUninitialized: false,
    resave: true
}));

// passport middleware
router.use(passport.initialize());
router.use(passport.session());
router.use(require('connect-flash')());

// render login page
router.get('/', (req,res) => res.render('login', {
    profileurl: '/profile/' + req.session.uname,
    isLoggedIn: req.session.isLoggedIn, 
    pagename: 'Log In',
    user: req.session.uname,
    title: 'Log In'
}));

// post login handle
router.post('/logcheck', 
    function(req, res, next) {
        passport.authenticate('local', 
        function(err, user, info) {
            if(!user) {
                res.redirect('/login');
                console.log('Not a user!');
            }
            else {
                req.login(user, function(error) {
                    if (error) return next(error);
                    req.session.uname = req.body.uname;
                    req.session.isLoggedIn = true;
                    var success = '/profile/' + req.session.uname;
                    console.log('Request login successful!');
                    res.redirect(success)
                });
            }
        }) (req, res, next);
        console.log("LOGIN: " + req.isAuthenticated());
    }
);

// render register page
router.get('/register', (req,res) => res.render('signup', {
    profileurl: '/profile/' + req.session.uname,
    isLoggedIn: req.session.isLoggedIn,
    pagename: 'Sign Up',
    user: req.session.uname,
    title: 'Sign Up'
}));

// post/register new user to database
router.post('/insert', upload.single('imageprof'), function(req,res, next) {
//    var filepath = '../img/' + filename;

    var user = new Profile({
//        profilepic: filepath,
        email: req.body.email,
        fullname: req.body.fullname,
        uname: req.body.uname,
        credibility:req.body.credibility,
        password:req.body.password
    });

    // hash the password
    bcrypt.genSalt(10, (err, salt) => 
        bcrypt.hash(user.password, salt, (err,hash)=>{
            if(err) throw err;
            user.password = hash;
        })
    );

    // connect to the db
    mongoose.connect(url, { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(err, db) {
        assert.equal(null, err);
        db.collection('profiles').insertOne(user, function(err,result) {
            assert.equal(null, err);
            console.log('New profile created');
            res.redirect('/login');
            // db.close();
        });
    });
});

passport.serializeUser(function(id, done) {
    done(null, id);
});

passport.deserializeUser(function(id, done) {
    done(null, id);
});

module.exports = router;