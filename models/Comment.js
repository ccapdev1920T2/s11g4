const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    comm_ownerID:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    edited:{
        type: String
    },
    recipeID:{
        type: String,
        required: true
    },
    date_created:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', CommentSchema);