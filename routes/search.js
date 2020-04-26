const express = require('express');
const router = express.Router();
const assert = require('assert');
const mongoose = require('mongoose');
const url = 'mongodb+srv://recipy:pass123@recipydb-nzcto.mongodb.net/test?retryWrites=true&w=majority';
const bodyParser = require('body-parser');
const session = require('express-session');
const passport =  require('passport');  

const searchcontroller = require('../controller/searchcontroller.js');

router.use(bodyParser.urlencoded({ extended: true }));

router.use(session({
    secret: 'keyboard cat',
    resave:true,
    saveUninitialized: true
}));

router.use(passport.initialize());
router.use(passport.session());

router.post('/', searchcontroller.postSearch);

passport.serializeUser(function(id, done) {
    done(null, id);
});

passport.deserializeUser(function(id, done) {
    done(null, id);
});

module.exports = router;