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

const recipecontroller = {
    getRecipeFile: function (req, res) {
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
    }
}

module.exports = recipecontroller;