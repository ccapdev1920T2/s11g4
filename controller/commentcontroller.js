const Comment = require('../models/Comment');
const assert = require('assert');
const mongoose = require('mongoose');
const url = 'mongodb+srv://recipy:pass123@recipydb-nzcto.mongodb.net/test?retryWrites=true&w=majority';

const commentcontroller = {
    postAddComment: function(req,res, next) {
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
    },

    postDeleteComment: function(req, res) {
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
    },

    postEditComment: function(req, res) {
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
    }
}

module.exports = commentcontroller;