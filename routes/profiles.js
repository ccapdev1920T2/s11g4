const express = require('express');
const router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');
const passport =  require('passport');  

const profilecontroller = require('../controller/profilecontroller.js');

router.use(session({
    secret: 'keyboard cat',
    resave:true,
    saveUninitialized: true
}));

// Passport Middleware
router.use(passport.initialize());
router.use(passport.session());

router.use(bodyParser.urlencoded({ extended: true }));

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

router.get('/faverecipes', profilecontroller.getFaveRecipes);


router.get('/faveuser', profilecontroller.getFaveUser);

router.post('/addToFav/:id', profilecontroller.postAddFave);

router.post('/removeToFav/:id', profilecontroller.postRemoveFave);


// gets back all the posts
router.get('/:uname', profilecontroller.getProfile);

// updates profile
router.post('/updateProfile', upload.single('editimageprof'), profilecontroller.postUpdateProfile);

// Deletes posted recipes
router.post('/deleteRecipe/:recipe_name', profilecontroller.postDeleteRecipe);

passport.serializeUser(function(id, done) {
    done(null, id);
});

passport.deserializeUser(function(id, done) {
    done(null, id);
});

module.exports = router;