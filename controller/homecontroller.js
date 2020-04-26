const assert = require('assert');
const mongoose = require('mongoose');
const url = 'mongodb+srv://recipy:pass123@recipydb-nzcto.mongodb.net/test?retryWrites=true&w=majority';

const homecontroller = {
    getHome: function (req, res) {
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
    }
}

module.exports = homecontroller;