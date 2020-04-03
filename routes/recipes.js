const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const assert = require('assert');
const mongoose = require('mongoose');
const url = 'mongodb+srv://recipy:pass123@recipydb-nzcto.mongodb.net/test?retryWrites=true&w=majority';

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

const session = require('express-session');

router.use(session({
    secret: 'keyboard cat',
    resave:true,
    saveUninitialized: true
}));

//Multer to accept images
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

// Functions
function getProfPic(profiles, recipes){
    for (var i = 0; i < recipes.length; i++)
    {
        for (var j = 0; j < profiles.length; j++)
        {
            if (recipes[i].recipe_owner == profiles[j].uname)
            recipes[i].profilepic = profiles[j].profilepic;
        }
    }
}

function getRecipes (path, req, res){
    var page;
    if (path == '/appetizers-and-snacks')
        page = "Appetizers & Snacks";
    else if (path == '/breakfast')
        page = "Breakfast";
    else if (path == '/desserts')
        page = "Desserts";
    else if (path == '/drinks')
        page = "Drinks";
    else if (path == '/lunch-and-dinner')
        page = "Lunch & Dinner";
    else if (path == '/pastries')
        page = "Pastries";
    else if (path == '/salads')
        page = "Salads";
    else if (path == '/others')
        page = "Others";
    

    var recipes = []; 
    var profiles = []; 
    mongoose.connect(url,
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        },function(err,db){
        var sort = { recipe_name: 1 }; 
        assert.equal(null, err);
        var cursor = db.collection('recipes').find({recipe_category:page}).sort(sort);
        var cursor2 = db.collection('profiles').find();
        cursor.forEach(function(doc, err){
            assert.equal(null, err);
            recipes.push(doc);
        },function(){
            cursor2.forEach(function(doc2, err){
                assert.equal(null, err);
                profiles.push(doc2);
            }, function(){
                getProfPic(profiles, recipes);
                res.render('feed', {
                    profileurl: "/profile/" + req.session.uname,
                    isLoggedIn: req.session.isLoggedIn, 
                    pagename: "Recipes", 
                    recipe_post: recipes, profiles, 
                    title: page});
            });
        });
    });
}

// Render All Recipes Page
router.get('/', function (req, res) {
    var recipes = []; 
    var profiles = []; 
    mongoose.connect(url,
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        },function(err,db){
        var sort = { recipe_name: 1 }; 
        assert.equal(null, err);
        var cursor = db.collection('recipes').find().sort(sort);
        var cursor2 = db.collection('profiles').find();
        cursor.forEach(function(doc, err){
            assert.equal(null, err);
            recipes.push(doc);
        },function(){
            cursor2.forEach(function(doc2, err){
                assert.equal(null, err);
                profiles.push(doc2);
            }, function(){

                getProfPic(profiles, recipes);
                res.render('feed', {
                    profileurl: "/profile/" + req.session.uname,
                    isLoggedIn: req.session.isLoggedIn, 
                    pagename: "Recipes", 
                    recipe_post: recipes, profiles, 
                    title: 'All Recipes'});
            });
        });
    });
});

// Render All Appetizers and Snacks Page
router.get('/appetizers-and-snacks', function (req, res) {
    getRecipes(req.path, req, res);
});

// Render Breakfast Page
router.get('/breakfast', function (req, res) {
    getRecipes(req.path, req, res);
});

// Render Desserts Page
router.get('/desserts', function (req, res) {
    getRecipes(req.path, req, res);
});

// Render Drinks Page
router.get('/drinks', function (req, res) {
    getRecipes(req.path, req, res);
});

// Render Lunch and Dinner Page
router.get('/lunch-and-dinner', function (req, res) {
    getRecipes(req.path, req, res);
});

// Render Pastries Page
router.get('/pastries', function (req, res) {
    getRecipes(req.path, req, res);
});


// Render Salads Page
router.get('/salads', function (req, res) {
    getRecipes(req.path, req, res);
});

// Render Others Page
router.get('/others', function (req, res) {
    getRecipes(req.path, req, res);
});


router.post('/insert', upload.single('recipe_img'),  function(req,res, next) {
    //getting the data from post
    var filepath = "../img/" + filename;
    var recipe = new Recipe({
        recipe_img: filepath,
        recipe_name:req.body.recipe_name,
        recipe_owner: req.session.uname,
        recipe_category: req.body.recipe_category,
        recipe_description:req.body.recipe_description,
        recipe_procedures: req.body.recipe_procedures,
        recipe_ingredients: req.body.recipe_ingredients
     });

    mongoose.connect(url,
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function(err, db){
            assert.equal(null, err);
            db.collection('recipes').insertOne(recipe, function(err,result){
            assert.equal(null, err);
            console.log('Recipe saved');
            var profile = "/profile/" + req.session.uname;
            res.redirect(profile);
            db.close();
        });
    });
    
});

// NEWWWW
router.post('/upvote/:id', function(req,res, next) {
    var ObjectId = require('mongodb').ObjectID;
    mongoose.connect(url, 
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function(err, db){
        assert.equal(null, err);
        db.collection('recipes').updateOne({'_id': ObjectId(req.params.id)}, {$inc: {numUpvote:1}}, function(err,result){
        assert.equal(null, err);
        console.log('Upvoted');
        var recipepost = "/recipes/" + req.params.id;
        res.redirect(recipepost);
        console.log(recipepost);
        db.close();
        });
    });
});


router.get('/:recipeid', function (req, res) {
    var recipes = []; 
    var profiles = []; 
    var ObjectId = require('mongodb').ObjectID; //NEW
    mongoose.connect(url,
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        },function(err,db){
        var sort = { recipe_name: 1 }; 
        assert.equal(null, err);
        var cursor = db.collection('recipes').find({"_id" : ObjectId(req.params.recipeid)}); //NEW
        var cursor2 = db.collection('profiles').find();
        cursor.forEach(function(doc, err){
            assert.equal(null, err);
            recipes.push(doc);
        },function(){
            cursor2.forEach(function(doc2, err){
                assert.equal(null, err);
                profiles.push(doc2);
            }, function(){

                getProfPic(profiles, recipes);
                res.render('recipepost', {
                    profileurl: "/profile/" + req.session.uname,
                    isLoggedIn: req.session.isLoggedIn, 
                    pagename: "Recipes", 
                    recipe_post: recipes, profiles, 
                    title: 'All Recipes'});
            });
        });
    });
});






//get specific post
router.get('/:postId', async (req, res)=>{
    try{
        const post = await Post.findById(req.params.postId);
        res.json(post);
    }
    catch(err){
        res.json({message: err});
    }
});

//delete a specific post 
router.delete('/:postId', async (req, res)=>{
    try{
        const removePost = await Post.remove({_id: req.params.postId});
        res.json(removePost);
    }
    catch(err){
        res.json({message: err});
    }
});

//Update a post
router.patch('/:postId', async (req, res)=>{
    try{
        const updatePost = await Post.updateOne(
            {_id: req.params.postId},
            {$set:{title: req.body.title}   }
        );
        res.json(updatePost);
    }
    catch(err){
        res.json({message: err});
    }
});

module.exports = router;