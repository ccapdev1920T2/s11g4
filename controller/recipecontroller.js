const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
const assert = require('assert');
const mongoose = require('mongoose');
const url = 'mongodb+srv://recipy:pass123@recipydb-nzcto.mongodb.net/test?retryWrites=true&w=majority';

function getProfPic(profiles, recipes) {
    for (var i = 0; i < recipes.length; i++)
    {
        for (var j = 0; j < profiles.length; j++)
        {
            if (recipes[i].recipe_owner == profiles[j].uname)
            recipes[i].profilepic = profiles[j].profilepic;
        }
    }
}

function getRecipes (path, req, res) {
    var page;

    if (path == '/appetizers-and-snacks')
        page = 'Appetizers & Snacks';
    else if (path == '/breakfast')
        page = 'Breakfast';
    else if (path == '/desserts')
        page = 'Desserts';
    else if (path == '/drinks')
        page = 'Drinks';
    else if (path == '/lunch-and-dinner')
        page = 'Lunch & Dinner';
    else if (path == '/pastries')
        page = 'Pastries';
    else if (path == '/salads')
        page = 'Salads';
    else if (path == '/others')
        page = 'Others';
    
    var recipes = []; 
    var profiles = []; 

    mongoose.connect(url, { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(err,db) {
        var sort = { recipe_name: 1 }; 
        assert.equal(null, err);
        var cursor = db.collection('recipes').find({recipe_category:page}).sort(sort);
        var cursor2 = db.collection('profiles').find();
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            recipes.push(doc);
        }, function() {
            cursor2.forEach(function(doc2, err) {
                assert.equal(null, err);
                profiles.push(doc2);
            }, function() {
                getProfPic(profiles, recipes);
                res.render('feed', {
                    profileurl: "/profile/" + req.session.uname,
                    isLoggedIn: req.session.isLoggedIn, 
                    pagename: "Recipes", 
                    recipe_post: recipes, profiles, 
                    title: page,
                    user: req.session.uname
                });
            });
        });
    });
}

const recipecontroller = {
    getAllRecipes: function (req, res) {
        var recipes = []; 
        var profiles = []; 
        console.log ("RECIPES: " + req.isAuthenticated());
    
        mongoose.connect(url, { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function(err,db) {
            var sort = { recipe_name: 1 }; 
            assert.equal(null, err);
            var cursor = db.collection('recipes').find().sort(sort);
            var cursor2 = db.collection('profiles').find();
            cursor.forEach(function(doc, err) {
                assert.equal(null, err);
                recipes.push(doc);
            }, function() {
                cursor2.forEach(function(doc2, err) {
                    assert.equal(null, err);
                    profiles.push(doc2);
                }, function() {
                    getProfPic(profiles, recipes);
                    res.render('feed', {
                        profileurl: '/profile/' + req.session.uname,
                        isLoggedIn: req.session.isLoggedIn, 
                        pagename: 'Recipes', 
                        recipe_post: recipes, profiles, 
                        title: 'All Recipes',
                        user: req.session.uname
                    });
                });
            });
        });
    },

    getAppeSnacks: function (req, res) {
        console.log ("RECIPES: " + req.isAuthenticated());
        getRecipes(req.path, req, res);
    },

    getBreakfast: function (req, res) {
        console.log ("RECIPES: " + req.isAuthenticated());
        getRecipes(req.path, req, res);
    },

    getDesserts: function (req, res) {
        console.log ("RECIPES: " + req.isAuthenticated());
        getRecipes(req.path, req, res);
    },

    getDrinks: function (req, res) {
        console.log ("RECIPES: " + req.isAuthenticated());
        getRecipes(req.path, req, res);
    },

    getLunch: function (req, res) {
        console.log ("RECIPES: " + req.isAuthenticated());
        getRecipes(req.path, req, res);
    },

    getPastries: function (req, res) {
        console.log ("RECIPES: " + req.isAuthenticated());
        getRecipes(req.path, req, res);
    },

    getSalads: function (req, res) {
        console.log ("RECIPES: " + req.isAuthenticated());
        getRecipes(req.path, req, res);
    },

    getOthers: function (req, res) {
        console.log ("RECIPES: " + req.isAuthenticated());
        getRecipes(req.path, req, res);
    },

    postNewRecipe: function(req,res, next) {
        //getting the data from post
        var filepath = '../img/' + filename;
    
        var recipe = new Recipe({
            recipe_img: filepath,
            recipe_name:req.body.recipe_name,
            recipe_owner: req.session.uname,
            recipe_category: req.body.recipe_category,
            recipe_description:req.body.recipe_description,
            recipe_procedures: req.body.recipe_procedures,
            recipe_ingredients: req.body.recipe_ingredients
        });
    
        mongoose.connect(url, { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function(err, db) {
            assert.equal(null, err);
            db.collection('recipes').insertOne(recipe, function(err,result) {
                assert.equal(null, err);
                var profile = '/profile/' + req.session.uname;
                res.redirect(profile);
                db.close();
            });
        });
    },

    postUpvote: function(req, res, next) {
        var ObjectId = require('mongodb').ObjectID;
    
        mongoose.connect(url, { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function(err, db) {
            assert.equal(null, err);
            db.collection('recipes').updateOne({'_id': ObjectId(req.params.id)}, {$inc: {numUpvote:1}}, function(err,result) {
                assert.equal(null, err);
                console.log('Upvoted');
    
                var recipepost = '/recipes/' + req.params.id;
                //res.redirect(recipepost);
                res.end();
                db.close();
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
            db.collection('profiles').updateOne({'uname': user}, {$push: { favoriteRecipes: req.params.id }}, function(err,result) {
                
                assert.equal(null, err);
                console.log('Added to favorites');
                var recipepost = '/recipes/' + req.params.id;
                res.redirect(recipepost);
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
            db.collection('profiles').updateOne({'uname': user}, {$pull: { favoriteRecipes: req.params.id }}, function(err,result) {
                assert.equal(null, err);
                console.log('Removed to favorites');
                var recipepost = '/recipes/' + req.params.id;
                res.redirect(recipepost);
                db.close();
            });
        });
    }
}

module.exports= recipecontroller;