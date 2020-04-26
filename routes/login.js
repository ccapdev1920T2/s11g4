const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');

const logincontroller = require('../controller/logincontroller.js');

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
router.get('/', logincontroller.getLogin);

// post login handle
router.post('/logcheck', logincontroller.postLogCheck);

// render register page
router.get('/register', logincontroller.getRegister);

router.get('/getCheckUsername', logincontroller.getCheckUsername);

// post/register new user to database
router.post('/insert', upload.single('imageprof'), logincontroller.postInsert);

passport.serializeUser(function(id, done) {
    done(null, id);
});

passport.deserializeUser(function(id, done) {
    done(null, id);
});

module.exports = router;