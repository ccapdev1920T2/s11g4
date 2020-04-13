const mongoose = require('mongoose');

const RecipeSchema = mongoose.Schema({
    recipe_img:{
        type: String
    },
    recipe_name:{
        type: String,
        required: true
    },
    recipe_owner:{
        type: String,
        required: true
    },
    recipe_category:{
        type: String,
        required: true
    },
    recipe_description:{
        type: String,
        required: true
    },
    recipe_procedures:{
        type: String,
        required: false
    },
    recipe_ingredients:{
        type: String,
        required: false
    }, 
    date_created:{
        type: Date,
        default: Date.now
    },
    favorited:{
        type: String,
        default: "Add to Favorites"
    },
    numUpvote:{
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Recipe', RecipeSchema)