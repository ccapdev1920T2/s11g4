const mongoose = require('mongoose');
const RecipeSchema = mongoose.Schema({
    uname:{
        type: String,
        required: true
    },
    recipe_img: {
        type: String
    },
    recipe_name:{
        type: String,
        required: true
    },
    recipe_owner: {
        type: String,
        required: true
    },
    recipe_category: {
        type: String,
        required: true
    },
    recipe_description:{
        type: String,
        required: true
    },
    recipe_procedures: {
        type: String,
        required: false
    },
    recipe_ingredients: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Recipe', RecipeSchema)