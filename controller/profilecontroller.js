const mongoose = require('mongoose');
const assert = require('assert');
const url = 'mongodb+srv://recipy:pass123@recipydb-nzcto.mongodb.net/test?retryWrites=true&w=majority';

const profilecontroller = {
    getFaveRecipes: function (req, res) {
        var recipes = []; 
        var profiles = []; 
        var favrecipes = [];
        var ObjectId = require('mongodb').ObjectID;
    
        mongoose.connect(url, { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function(err,db) {
            assert.equal(null, err);
            var cursor = db.collection('recipes').find({});
            var cursor2 = db.collection('profiles').find({'uname':req.session.uname});
            cursor.forEach(function(doc, err) {
                assert.equal(null, err);
                recipes.push(doc);
            }, function() {
                cursor2.forEach(function(doc2, err) {
                    assert.equal(null, err);
                    profiles.push(doc2);
                }, function(){
                    for (i = 0; i < profiles[0].favoriteRecipes.length; i++)
                    {
                        for (j = 0; j < recipes.length; j++)
                        {
                            if (profiles[0].favoriteRecipes[i] == recipes[j]._id)
                            {
                                favrecipes.push(recipes[j]);
                            }
                        }
                        
                    }
    
                    res.render('faverecipes', {
                        profile: profiles, favrecipes,
                        profileurl: '/profile/' + req.session.uname,
                        isLoggedIn: req.session.isLoggedIn,
                        pagename: 'Profile',
                        user: req.session.uname,
                        title: "Favorite Recipes"
                    });
                });
            });
        });
    },

    getFaveUser: function (req, res) {
        var users = []; 
        var profiles = []; 
        var favUsers = [];
        var ObjectId = require('mongodb').ObjectID;
    
        mongoose.connect(url, { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function(err,db) {
            assert.equal(null, err);
            var cursor = db.collection('profiles').find({});
            var cursor2 = db.collection('profiles').find({'uname':req.session.uname});
            cursor.forEach(function(doc, err) {
                assert.equal(null, err);
                users.push(doc);
            }, function() {
                cursor2.forEach(function(doc2, err) {
                    assert.equal(null, err);
                    profiles.push(doc2);
                }, function(){
                    for (i = 0; i < profiles[0].favoriteUsers.length; i++)
                    {
                        for (j = 0; j < users.length; j++)
                        {
                            if (profiles[0].favoriteUsers[i] == users[j].uname)
                            {
                                favUsers.push(users[j]);
                            }
                        }
                        
                    }
                    res.render('userfave', {
                        profile: profiles, favUsers,
                        profileurl: '/profile/' + req.session.uname,
                        isLoggedIn: req.session.isLoggedIn,
                        pagename: 'Profile',
                        user: req.session.uname,
                        title: "Favorite Users"
                    });
                });
            });
        });
    },

    postAddFave: function(req, res, next) {
        var ObjectId = require('mongodb').ObjectID;
        var user = req.session.uname;
    
        mongoose.connect(url, { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function(err, db) {
            assert.equal(null, err);
            db.collection('profiles').updateOne({'uname': user}, {$push: { favoriteUsers: req.params.id }}, function(err,result) {
                assert.equal(null, err);
                console.log('Added to favorites');
                var profile = '/profile/' + req.params.id;
                res.redirect(profile);
                db.close();
            });
        });
    },

    postRemoveFave: function(req, res, next) {
        var ObjectId = require('mongodb').ObjectID;
        var user = req.session.uname;
    
        mongoose.connect(url, { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function(err, db) {
            assert.equal(null, err);
            db.collection('profiles').updateOne({'uname': user}, {$pull: { favoriteUsers: req.params.id }}, function(err,result) {
                assert.equal(null, err);
                console.log('Removed to favorites');
                var profile = '/profile/' + req.params.id;
                res.redirect(profile);
                db.close();
            });
        });
    },

    getProfile: function (req, res) {
        var recipes = []; 
        var profiles = []; 
        var users = [];
        console.log("PROFILE: " + req.isAuthenticated());
    
        mongoose.connect(url, { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function(err,db) {
            assert.equal(null, err);
            var cursor = db.collection('recipes').find({'recipe_owner':req.params.uname});
            var cursor2 = db.collection('profiles').find({'uname':req.params.uname});
            var cursor3 = db.collection('profiles').find();
            db.collection('profiles').updateOne({'uname': req.params.uname}, {'$set':{'favorited': "Add to Favorites"}}, function(err,result)  {
            cursor.forEach(function(doc, err) {
                assert.equal(null, err);
                recipes.push(doc);
            }, function(){
                cursor2.forEach(function(doc2, err) {
                    assert.equal(null, err);
                    profiles.push(doc2);
                }, function() {
                    cursor3.forEach(function(doc3, err) {
                        assert.equal(null, err);
                        users.push(doc3);
                        
                    },
                    function() {
                        for (m = 0; m < users.length; m++){
                            if (users[m].uname == req.session.uname){
                                for (k = 0; k < users[m].favoriteUsers.length; k++) {
                                    if (users[m].favoriteUsers[k] == req.params.uname){
                                        profiles[0].favorited = "Favorited";
                                        db.collection('profiles').updateOne({'uname': profiles[0].uname}, {'$set':{'favorited': "Favorited"}}, function(err,result)  {
                                        });
                                    }
                                }
                            }
                        }
    
                    if (req.params.uname == req.session.uname) {
                        res.render('profile', {
                            profile: profiles, recipes,
                            profileurl: '/profile/' + req.session.uname,
                            isLoggedIn: req.session.isLoggedIn,
                            pagename: 'Profile',
                            user: req.session.uname,
                            title: "Profile"
                        });
                    }
                    else {
                        res.render('profile', {
                            profile: profiles, recipes,
                            profileurl: '/profile/' + req.session.uname,
                            isLoggedIn: req.session.isLoggedIn,
                            pagename: '',
                            user: req.session.uname,
                            title: "@" + req.params.uname + "'s Profile"
                        });
                    }
                });
                });
                });
            });
        });
    },

    postUpdateProfile: function(req,res, next) {
        var filepath = '../img/' + filename;
        var user = {
            profilepic: filepath,
            fullname: req.body.editprofilename,
            uname: req.body.editusername,
            credibility:req.body.credibility,
        };
        var name = req.session.uname;
    
        // connect to the db
        mongoose.connect(url, { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function(err, db) {
            assert.equal(null, err);
            db.collection('profiles').updateOne({'uname': name}, {$set: user}, function(err,result) {
                assert.equal(null, err);
                console.log('New profile updated');
            });
            db.collection('profiles').updateMany({'favoriteUsers': name}, {$set: {'favoriteUsers.$': user.uname}}, function(err, result) {
                assert.equal(null, err);
                console.log('Favorite profile updated!!!');
            })
            db.collection('recipes').updateMany({'recipe_owner': name}, {'$set':{'recipe_owner': user.uname}}, function(err,result) {
                assert.equal(null, err);
                req.session.uname = user.uname;
                var profile = '/profile/' + req.session.uname;
                res.redirect(profile);
                db.close();
            });
        });
    },

    postDeleteRecipe: function(req, res) {
        console.log("Recipe deleted");
        var id = req.params.recipe_name;
        
        //connecting to db
        mongoose.connect(url, { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function(err, db)
            {
                db.collection('recipes').deleteOne({"recipe_name": id}, function(err, result) {
                    assert.equal(null, err);
                    var profile = "/profile/" + req.session.uname;
                    res.redirect(profile);
                    db.close();
                });
            });
    }
}

module.exports = profilecontroller;