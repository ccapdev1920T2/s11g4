const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const passport =  require('passport');  

const recipecontroller = require('../controller/recipecontroller.js');
const commentcontroller = require('../controller/commentcontroller.js');
const srecipecontroller = require('../controller/srecipecontroller.js');

router.use(bodyParser.urlencoded({ extended: true }));

router.use(session({
    secret: 'keyboard cat',
    resave:true,
    saveUninitialized: true
}));

router.use(passport.initialize());
router.use(passport.session());

// multer to accept images
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

// render all recipes page
router.get('/', recipecontroller.getAllRecipes);

// render all appetizers and snacks page
router.get('/appetizers-and-snacks', recipecontroller.getAppeSnacks);

// render breakfast page
router.get('/breakfast', recipecontroller.getBreakfast);

// render desserts page
router.get('/desserts', recipecontroller.getDesserts);

// render drinks page
router.get('/drinks', recipecontroller.getDrinks);

// render lunch and dinner page
router.get('/lunch-and-dinner', recipecontroller.getLunch);

// render pastries page
router.get('/pastries', recipecontroller.getPastries);

// render salads page
router.get('/salads', recipecontroller.getSalads);

// render others page
router.get('/others', recipecontroller.getOthers);

router.post('/insert', upload.single('recipe_img'), recipecontroller.postNewRecipe);

router.post('/upvote/:id', recipecontroller.postUpvote);

router.post('/addToFav/:id', recipecontroller.postAddFave);

router.post('/removeToFav/:id', recipecontroller.postRemoveFave);

router.get('/:recipeid', srecipecontroller.getRecipeFile);

router.post('/insertComment/:id/:comment', commentcontroller.postAddComment);

// deletes posted comments
router.post('/deleteComment/:commentid', commentcontroller.postDeleteComment);

router.post('/editComment/:recipeid/:commentid/:newcomm', commentcontroller.postEditComment);

passport.serializeUser(function(id, done) {
    done(null, id);
});

passport.deserializeUser(function(id, done) {
    done(null, id);
});

module.exports = router;