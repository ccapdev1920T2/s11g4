const assert = require('assert');
const mongoose = require('mongoose');
const url = 'mongodb+srv://recipy:pass123@recipydb-nzcto.mongodb.net/test?retryWrites=true&w=majority';

function getSchema () {
    var s = mongoose.Schema({
        array: [String]
    });
    s.index({ array: 'text' })
    return s;
}

const searchcontroller = {
    postSearch: function(req, res) {
        console.log('SEARCH RESULTS: ' + req.isAuthenticated());
        console.log('Searching for a recipe: ' + req.body.searchtext);
        var userinput = req.body.searchtext;
        var recipes = [];
    
        mongoose.connect(url, { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function(err,db) {
            var sort = { recipe_name: 1 }; 
            assert.equal(null, err);
            var cursor = db.collection('recipes').find({'recipe_name': { '$regex': userinput, '$options': 'i'}}).sort(sort);
            cursor.forEach(function(doc, err) {
                assert.equal(null, err);
                recipes.push(doc);
            }, function() {
                res.render('home', {
                    headingtitle: 'Search Results',
                    searchresults: 'You searched for: ',
                    searchfor: userinput,
                    search_post: recipes,
                    profileurl: '/profile/' + req.session.uname,
                    isLoggedIn: req.session.isLoggedIn, 
                    pagename: '',
                    title: 'Search Results'
                });
            });
        });
    }
}

module.exports = searchcontroller;