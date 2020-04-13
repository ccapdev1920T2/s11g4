const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
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

// functions
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

// render all recipes page
router.get('/', function (req, res) {
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
});

// render all appetizers and snacks page
router.get('/appetizers-and-snacks', function (req, res) {
    console.log ("RECIPES: " + req.isAuthenticated());
    getRecipes(req.path, req, res);
});

// render breakfast page
router.get('/breakfast', function (req, res) {
    console.log ("RECIPES: " + req.isAuthenticated());
    getRecipes(req.path, req, res);
});

// render desserts page
router.get('/desserts', function (req, res) {
    console.log ("RECIPES: " + req.isAuthenticated());
    getRecipes(req.path, req, res);
});

// render drinks page
router.get('/drinks', function (req, res) {
    console.log ("RECIPES: " + req.isAuthenticated());
    getRecipes(req.path, req, res);
});

// render lunch and dinner page
router.get('/lunch-and-dinner', function (req, res) {
    console.log ("RECIPES: " + req.isAuthenticated());
    getRecipes(req.path, req, res);
});

// render pastries page
router.get('/pastries', function (req, res) {
    console.log ("RECIPES: " + req.isAuthenticated());
    getRecipes(req.path, req, res);
});

// render salads page
router.get('/salads', function (req, res) {
    console.log ("RECIPES: " + req.isAuthenticated());
    getRecipes(req.path, req, res);
});

// render others page
router.get('/others', function (req, res) {
    console.log ("RECIPES: " + req.isAuthenticated());
    getRecipes(req.path, req, res);
});

router.post('/insert', upload.single('recipe_img'),  function(req,res, next) {
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
});

router.post('/upvote/:id', function(req, res, next) {
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
            res.redirect(recipepost);
            db.close();
        });
    });
});

router.post('/addToFav/:id', function(req, res, next) {
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
});

router.post('/removeToFav/:id', function(req, res, next) {
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
});

router.get('/:recipeid', function (req, res) {
    var recipes = []; 
    var profiles = []; 
    var comments = [];
    console.log ("RECIPES: " + req.isAuthenticated());
    req.session.recipeID = req.params.recipeid;
    var ObjectId = require('mongodb').ObjectID; 
    
    mongoose.connect(url, { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(err,db) {
        assert.equal(null, err);
        var cursor = db.collection('recipes').find({'_id' : ObjectId(req.params.recipeid)}); 
        var cursor2 = db.collection('profiles').find();
        var cursor3 = db.collection('comments').find({'recipeID' : req.params.recipeid});

        db.collection('recipes').updateOne({'_id': ObjectId(req.params.recipeid)}, {'$set':{'favorited': "Add to Favorites"}}, function(err,result)  {
       
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            recipes.push(doc);
        }, function() {
            cursor2.forEach(function(doc2, err) {
                assert.equal(null, err);
                profiles.push(doc2);
            }, function() {
                cursor3.forEach(function(doc3, err) {
                    assert.equal(null, err);
                    comments.push(doc3);
                }, function() {
                    var count;

                    for (i = 0; i < recipes.length; i++)
                    {
                        var recipe_name = recipes[i].recipe_name;
                    }

                    for (i = 0; i < comments.length; i++)
                    {
                        for (j = 0; j < profiles.length; j++)
                        {
                            var profileID = (profiles[j]._id).toString(); 
                            if (comments[i].comm_ownerID == profileID) {
                                comments[i].commenter_name = profiles[j].uname;
                                comments[i].commenter_img = profiles[j].profilepic;
                                comments[i].count = count;
                            }
                        }
                    }

                    for (k = 0; k < profiles.length; k++){
                        if (profiles[k].uname == req.session.uname)
                        {
                            for (l = 0; l < profiles[k].favoriteRecipes.length; l++)
                            {
                                if (profiles[k].favoriteRecipes[l] == req.params.recipeid)
                                {
                                    db.collection('recipes').updateOne({'_id': ObjectId(req.params.recipeid)}, {'$set':{'favorited': "Favorited"}}, function(err,result)  {
                                        // db.close();
                                    });

                                    for (m = 0; m < recipes.length; m++)
                                    {
                                        if (req.params.recipeid == recipes[m]._id)
                                        {
                                            recipes[m].favorited = "Favorited";
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                        getProfPic(profiles, recipes);
                        res.render('recipepost', {
                            profileurl: '/profile/' + req.session.uname,
                            isLoggedIn: req.session.isLoggedIn, 
                            pagename: 'Recipes', 
                            recipe_post: recipes, profiles, 
                            comment: comments,
                            title: recipe_name,
                            user: req.session.uname
                        });
                    });
                });
            });
        });
    });
});

router.post('/insertComment/:id/:comment', function(req,res, next) {
    //getting the data from post
     var comment = new Comment({
        content: req.params.comment,
        recipeID: req.params.id,
        edited: ""
     })
     
    mongoose.connect(url, { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(err, db) {
        assert.equal(null, err);

        db.collection('profiles').find({'uname': req.session.uname}).toArray(function(err, result) {
            if (err) throw err;
            comment.comm_ownerID = result[0]._id;

            db.collection('comments').insertOne(comment, function(err,result) {
                assert.equal(null, err);
                var recipeURL = '/recipes/' + req.params.id;
                res.redirect(recipeURL);
                // db.close();
            });
        });
    });
});

// deletes posted comments
router.post('/deleteComment/:commentid', function(req, res) {
    console.log("Comment deleted")
    var ObjectId = require('mongodb').ObjectID;
    //connecting to 
    mongoose.connect(url, { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(err, db) {
        db.collection('comments').deleteOne({'_id': ObjectId(req.params.commentid)}, function(err, result) {
            assert.equal(null, err);
            var recipepost = "/recipes/" + req.session.recipeID;
            res.redirect(recipepost);
            db.close();
        });
    });
});

router.post('/editComment/:recipeid/:commentid/:newcomm', function(req, res) {
    console.log("Comment edited");
    var ObjectId = require('mongodb').ObjectID;
    //connecting to 
    
    mongoose.connect(url, { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(err, db) {
        db.collection('comments').updateOne({'_id': ObjectId(req.params.commentid)}, {'$set':{'content': req.params.newcomm, 'edited': "(edited)"}}, function(err,result) {
            assert.equal(null, err);
            var recipepost = "/recipes/" + req.session.recipeID;
            res.redirect(recipepost);
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