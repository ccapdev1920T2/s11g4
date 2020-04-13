const mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({
    profilepic:{
        type: String,
        required: true,
        default: "../img/default.png"
    },
    email:{
        type: String,
        required: true
    },
    fullname:{
        type: String,
        required: true
    },
    uname:{
        type: String,
        required: true
    },
    credibility:{
        type: String,
        required: true
    },
    favoriteRecipes:{
        type: Array
    },
    favoriteUsers:{
        type: Array
    },
    password:{
        type: String,
        required: true
    },
    favorited:{
        type: String,
        default: "Add to Favorites"
    }
});

module.exports = mongoose.model('Profile', ProfileSchema);