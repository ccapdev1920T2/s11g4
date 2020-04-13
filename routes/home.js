const express = require('express');
const router = express.Router();
const assert = require('assert');
const mongoose = require('mongoose');
const url = 'mongodb+srv://recipy:pass123@recipydb-nzcto.mongodb.net/test?retryWrites=true&w=majority';
const bodyParser = require('body-parser');
const session = require('express-session');
const passport =  require('passport');  

router.use(bodyParser.urlencoded({ extended: true }));

router.use(session({
    secret: 'keyboard cat',
    resave:true,
    saveUninitialized: true
}));

router.use(passport.initialize());
router.use(passport.session());

router.get('/', function (req, res) {
    var recipes = [];
    console.log("HOME: " + req.isAuthenticated());
    mongoose.connect(url, { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(err,db) {
        var sort = { numUpvote: -1 , recipe_name : 1 }; 
        assert.equal(null, err);
        var cursor = db.collection('recipes').find().sort(sort).limit(10);

        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            recipes.push(doc);
        }, function() {
            res.render('home', {
                headingtitle: 'Featured Recipes',
                profileurl: '/profile/' + req.session.uname,
                isLoggedIn: req.session.isLoggedIn, 
                pagename: 'Home', 
                recipe_post: recipes,
                user: req.session.uname,
                title: 'Recipy'
            });
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