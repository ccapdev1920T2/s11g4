const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const passport =  require('passport');  

const homecontroller = require('../controller/homecontroller.js');

router.use(bodyParser.urlencoded({ extended: true }));

router.use(session({
    secret: 'keyboard cat',
    resave:true,
    saveUninitialized: true
}));

router.use(passport.initialize());
router.use(passport.session());

router.get('/', homecontroller.getHome);

passport.serializeUser(function(id, done) {
    done(null, id);
});

passport.deserializeUser(function(id, done) {
    done(null, id);
});

module.exports = router;