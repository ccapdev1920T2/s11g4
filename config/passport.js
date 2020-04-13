const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

//Load user Model
const User = require('../models/Profile');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'uname'}, (uname, password, done) =>{
            
            //Match User
            User.findOne({uname: uname})
                .then(user =>{
                    if(!user){
                        return done(null, false, {message: 'That email is not registered'});
                    }

                    //Match the Password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;
                        if(isMatch){
                            return done(null, user);
                        }
                        else{
                            return done(null, false, {message: 'Password wrong'});
                        }
                    });
                })
                .catch(err =>console.log(err));
        })
    );

    passport.serializeUser((user, done) =>{
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) =>{
        User.findById(id, (err, Profile) =>{
            done(err, Profile);
        });
    });
}