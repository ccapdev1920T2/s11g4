const mongoose = require('mongoose');
const ProfileSchema = mongoose.Schema({
    profilepic: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    uname: {
        type: String,
        required: true
    },
    credibility:{
        type: String,
        required: true
    },
    favorites: {
        type: String,
        default: "0"
    },
    favoriteRecipes: {
        type: Array
    },
    favoriteUsers: {
        type: Array
    },
    password: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('Profile', ProfileSchema);