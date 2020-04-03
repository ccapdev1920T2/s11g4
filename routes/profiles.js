const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const mongoose = require('mongoose');
const assert = require('assert');
const url = 'mongodb+srv://recipy:pass123@recipydb-nzcto.mongodb.net/test?retryWrites=true&w=majority';
const session = require('express-session');

router.use(session({
    secret: 'keyboard cat',
    resave:true,
    saveUninitialized: true
}));

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

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

router.get('/faverecipes', function (req, res) {
    var recipes = []; 
    var profiles = []; 
    var favrecipes = [];
    mongoose.connect(url,
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        },function(err,db){
        assert.equal(null, err);
        var cursor = db.collection('recipes').find({});
        var cursor2 = db.collection('profiles').find({'uname':req.session.uname});
        cursor.forEach(function(doc, err){
            assert.equal(null, err);
            recipes.push(doc);
        },function(){
            cursor2.forEach(function(doc2, err){
                assert.equal(null, err);
                profiles.push(doc2);
            }, function(){
                
                    //console.log(profiles[0].favoriteRecipes[0]);
                    for (i = 0; i < profiles[0].favoriteRecipes.length; i++)
                    {
                        console.log(profiles[0].favoriteRecipes[i]);
                        for (j = 0; j < recipes.length; j++)
                        {
                            if (profiles[0].favoriteRecipes[i] == recipes[j].recipe_name)
                            {
                                favrecipes.push(recipes[j]);
                            }
                        }
                        
                    }

            res.render('faverecipes', {profile: profiles, favrecipes,
                profileurl: "/profile/" + req.session.uname,
                isLoggedIn: req.session.isLoggedIn,
                pagename: "Profile"});
            });
        });
    });
});


// gets back all the posts
router.get('/:uname', function (req, res) {
    var recipes = []; 
    var profiles = []; 
    mongoose.connect(url,
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        },function(err,db){
        assert.equal(null, err);
        var cursor = db.collection('recipes').find({'recipe_owner':req.session.uname});
        var cursor2 = db.collection('profiles').find({'uname':req.session.uname});
        cursor.forEach(function(doc, err){
            assert.equal(null, err);
            recipes.push(doc);
        },function(){

            

            cursor2.forEach(function(doc2, err){
                assert.equal(null, err);
                profiles.push(doc2);

                /* UPDATING FAVRECIPES
                db.collection('profiles').findOneAndUpdate(
                    { uname: "sampaulino23" }, 
                    { $push: { 
                              favoriteRecipes: "aasdasd"
                            } 
                    })
                */

            }, function(){
            res.render('profile', {profile: profiles, recipes,
                profileurl: "/profile/" + req.session.uname,
                isLoggedIn: req.session.isLoggedIn,
                pagename: "Profile"});
            });
        });
    });
});

//updates profile
router.post('/updateProfile', upload.single('editimageprof'), function(req,res, next) {
    var filepath = "../img/" + filename;
    var user = {
        profilepic: filepath,
        fullname: req.body.editprofilename,
        uname: req.body.editusername,
        credibility:req.body.credibility,
    };
    
    var name = req.session.uname;
    console.log("HEY" + req.session.uname);
    //connect to the db
    mongoose.connect(url, 
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function(err, db){
        assert.equal(null, err);
        db.collection('profiles').updateOne({'uname': name}, {$set: user}, function(err,result){
        assert.equal(null, err);
        console.log('New profile created');
    });
        db.collection('recipes').updateMany({"recipe_owner": name}, {"$set":{"recipe_owner": user.uname}}, function(err,result){
        assert.equal(null, err);
        console.log('New profile created');
        req.session.uname = user.uname;
        var profile = "/profile/" + req.session.uname;
        res.redirect(profile);
        db.close();
    });
    
});
});




module.exports = router;