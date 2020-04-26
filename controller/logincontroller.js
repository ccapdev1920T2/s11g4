const Profile = require('../models/Profile');
const assert = require('assert');
const mongoose = require('mongoose');
const url = 'mongodb+srv://recipy:pass123@recipydb-nzcto.mongodb.net/test?retryWrites=true&w=majority';
const bcrypt = require('bcryptjs');
const passport = require('passport');

const logincontroller = {
    getLogin: function (req,res) {
        res.render('login', {
        profileurl: '/profile/' + req.session.uname,
        isLoggedIn: req.session.isLoggedIn, 
        pagename: 'Log In',
        user: req.session.uname,
        title: 'Log In'
    });
    },

    postLogCheck: function(req, res, next) {
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
    },

    getCheckUsername: function(req, res) {
        var uname = req.query.uname;

        mongoose.connect(url, { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function(err, db) {
            assert.equal(null, err);
            db.collection('profiles').findOne({uname: uname}, 'uname', function (err,result) {
                assert.equal(null, err);
                res.send(result);
            });
        });
    },

    getRegister: function (req,res) {
        res.render('signup', {
        profileurl: '/profile/' + req.session.uname,
        isLoggedIn: req.session.isLoggedIn,
        pagename: 'Sign Up',
        user: req.session.uname,
        title: 'Sign Up'
    });
    },

    postInsert: function(req,res, next) {
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
    }

}

module.exports = logincontroller;