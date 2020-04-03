const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = 3000;
const session = require('express-session');

app.use(session({
    secret: 'keyboard cat',
    resave:true,
    saveUninitialized: true
}));

require('dotenv/config');

//Middle use for body parser for postman app
app.use(bodyParser.json());

app.engine( 'hbs', exphbs({
    extname: 'hbs', // configures the extension name to be .hbs instead of .handlebars
    defaultView: 'main', // this is the default value but you may change it to whatever you'd like
    layoutsDir: path.join(__dirname, '/views/layouts'), // Layouts folder
    partialsDir: path.join(__dirname, '/views/partials'), // Partials folder
    
}));

app.set('view engine', 'hbs');

//Import Routes
const recipesRoute = require('./routes/recipes');
app.use('/recipes',recipesRoute);

const profilesRoute = require('./routes/profiles');
app.use('/profile',profilesRoute);

const loginRoute = require('./routes/login');
app.use('/login',loginRoute);

var home = ["/", "/home"];



app.get(home, function(req,res){
    console.log(req.session);
    res.render('home',{
        recipe_post:[
            {
                img: "img/recipe2-arrenantioquia.jpg",
                recipe_name: "Blueberry Cheesecake",
                recipe_owner: "Arren Antioquia"
            },
            {
                img: "img/recipe3-arrenantioquia.jpg",
                recipe_name: "Caesar Salad",
                recipe_owner: "Arren Antioquia"
            },
            {
                img: "img/recipe1-arrenantioquia.jpg",
                recipe_name: "Cheese Rolls",
                recipe_owner: "Arren Antioquia"
            },
            {
                img: "img/recipe5-giantiyan.jpg",
                recipe_name: "Chicken Tinola",
                recipe_owner: "Gian Chan"
            },
            {
                img: "img/recipe5-caiyohan.jpg",
                recipe_name: "Corn Salad",
                recipe_owner: "Yohan Cai"
            },
            {
                img: "img/recipe1-smnthpln23.jpg",
                recipe_name: "Red Velvet Cupcakes",
                recipe_owner: "Samantha Paulino"
            },
            {
                img: "img/recipe5-arrenantioquia.jpg",
                recipe_name: "Sangria",
                recipe_owner: "Arren Antioquia"
            },
            {
                img: "img/recipe5-shimeizhang08.jpg",
                recipe_name: "Strawberry Milkshake",
                recipe_owner: "Shimei Zhang"
            },
            {
                img: "img/recipe1-giantiyan.jpg",
                recipe_name: "Sugarcoated Rum and Raisins Bread",
                recipe_owner: "Gian Chan"
            },
            {
                img: "img/recipe2-caiyohan.jpg",
                recipe_name: "Ultimate Chocolate Chip Cookies",
                recipe_owner: "Yohan Cai"
            }
        ],
        profileurl: "/profile/" + req.session.uname,
        pagename: "Home",
        isLoggedIn: req.session.isLoggedIn
    });
});


app.get("/logout", function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

app.get('/createpost', function(req,res){
    console.log(req.session.uname);
    res.render('createpost',{
        profileurl: "/profile/" + req.session.uname,
        isLoggedIn: req.session.isLoggedIn
    });
});



app.post('/own-giantiyan', function(req,res) {
    res.render('profile', {
        title: "Gian Chan's Profile",
        profilepic: "img/gian.jpg",
        fullname: "Gian Chan",
        uname: "giantiyan",
        credibility: "baker",
        favorites: "15",
        recipes: [
            {
                ref: "/recipe1-giantiyan",
                recipe_pic: "img/recipe1-giantiyan.jpg",
                recipe_name: "Sugarcoated Rum and Raisins Bread",
                recipe_desc: "Inspired by a vacation visit to Jamaica, where it seemed rum bread was in every shop we entered, this amazing raisin bread gets a fine boozy soaking in rum after it is baked. This cake is terrific on it’s own, with custard, ice cream or as a frosted cake."
            },
            {
                ref: "/recipe2-giantiyan",
                recipe_pic: "img/recipe2-giantiyan.jpg",
                recipe_name: "Meringue Kisses",
                recipe_desc: "Thinking of what to give your significant other for valentines? Or maybe you just want to eat some light sweets? Either way this recipe is really fun to whip up and really easily customizable. Add different food colorings or swap out the piping tip to change the look of the kisses!"
            },
            {
                ref: "/recipe3-giantiyan",
                recipe_pic: "img/recipe3-giantiyan.jpg",
                recipe_name: "Fool-proof Brownies",
                recipe_desc: "These brownies always turn out gooey and so good! My brother had tried to make this on his own and it came out perfect."
            },
            {
                ref: "/recipe4-giantiyan",
                recipe_pic: "img/recipe4-giantiyan.jpg",
                recipe_name: "Pizza Calzone",
                recipe_desc: "Calzones are so underrated in my book. What’s not to love? - it’s like an individual pizza all wrapped up! No floppy soggy pizza crust and the best part? - customized filling!"
            },
            {
                ref: "/recipe5-giantiyan",
                recipe_pic: "img/recipe5-giantiyan.jpg",
                recipe_name: "Chicken Tinola",
                recipe_desc: "Tinola, the traditional chicken Filipino soup, is a healthy and delicious chicken and ginger dish that is perfect to cook for the family. Serve it with steamed rice or as is! Either way, you and your family members are sure to enjoy this recipe during the rainier seasons."
            }
        ]
    });
});

app.post('/own-smnthpln23', function(req,res) {
    res.render('profile', {
        title: "Samantha Paulino's Profile",
        profilepic: "img/sam.jpg",
        fullname: "Samantha Paulino",
        uname: "smnthpln23",
        credibility: "chef",
        favorites: "20",
        recipes: [
            {
                ref: "/recipe1-smnthpln23",
                recipe_pic: "img/recipe1-smnthpln23.jpg",
                recipe_name: "Red Velvet Cupcakes",
                recipe_desc: "Over the past year, the most requested recipe on my blog is… red velvet cupcakes. To be honest, I was never a huge fan of red velvet up until a few years ago. Is it chocolate? Is it vanilla? The flavor always leaves me confused."
            },
            {
                ref: "/recipe2-smnthpln23",
                recipe_pic: "img/recipe2-smnthpln23.jpg",
                recipe_name: "Flaky Pie Crust",
                recipe_desc: "Every baker should have a good pie crust recipe in their repertoire! A Good pie crust starts with flour and fat; that’s the basis, but what’s next? In this recipe, I’ll be sharing one that had been passed down through generations from my great great grandmother."
            },
            {
                ref: "/recipe3-smnthpln23",
                recipe_pic: "img/recipe3-smnthpln23.jpg",
                recipe_name: "Mozzarella Macaroni and Cheese",
                recipe_desc: "Every once in a while, everyone would crave mac and cheese. But how can one make a mac and cheese like how grandma used to make? Well, this recipe is just that! Grandma made this gooey cheesy mac and cheese at home and it is the easiest thing ever!"
            },
            {
                ref: "/recipe4-smnthpln23",
                recipe_pic: "img/recipe4-smnthpln23.jpg",
                recipe_name: "Lengua de Gato",
                recipe_desc: "When I went back to the province for the holiday, I have eaten a lot of food; one of them is Lengua de Gato. It is a thin cookie that resembles the shape of a cat’s tongue. In this recipe, I’ll be sharing how to make one at home so you’ll never have to miss this deliciousness!"
            },
            {
                ref: "/recipe5-smnthpln23",
                recipe_pic: "img/recipe5-smnthpln23.jpg",
                recipe_name: "Chicken and Green Bean Stir-Fry",
                recipe_desc: "This is the very first recipe that I’ve learned from my dad. It was our go-to dinner if we don’t know what to eat! I’m really excited to share this recipe as it was one of the few times my dad and I bonded over."
            }
        ]
    });
});

app.post('/own-shimeizhang08', function(req,res) {
    res.render('profile', {
        title: "Shimei Zhang's Profile",
        profilepic: "img/shimei.jpg",
        fullname: "Shimei Zhang",
        uname: "shimeizhang08",
        credibility: "homecook",
        favorites: "20",
        recipes: [
            {
                ref: "/recipe1-shimeizhang08",
                recipe_pic: "img/recipe1-shimeizhang08.jpg",
                recipe_name: "Baked Spaghetti",
                recipe_desc: "Why make regular spaghetti when you can make baked spaghetti with layers of gooey cheese on top? I have made this for family gatherings, and let me tell you, this is a crowd-pleaser!"
            },
            {
                ref: "/recipe2-shimeizhang08",
                recipe_pic: "img/recipe2-shimeizhang08.jpg",
                recipe_name: "Air-Fried Coconut Shrimp",
                recipe_desc: "I got an air fryer as a gift over the holidays and that got me interested in cooking (more like frying) in it. I tried to cook some small meals in it, and this is one of them. These amazing coconut shrimp gets so crispy despite the lack of actual frying and it goes so well with spicy mayo and rice!"
            },
            {
                ref: "/recipe3-shimeizhang08",
                recipe_pic: "img/recipe3-shimeizhang08.jpg",
                recipe_name: "Spaghetti Carbonara",
                recipe_desc: "Not sure what to eat? Craving some comfort food? For me, nothing beats a pasta like creamy carbonara. Best part is that it is easy to whip up! This recipe is so simple yet the taste is so complex and delicious!"
            },
            {
                ref: "/recipe4-shimeizhang08",
                recipe_pic: "img/recipe4-shimeizhang08.jpg",
                recipe_name: "Vanilla Cupcake",
                recipe_desc: "Who says vanilla is boring? I can’t remember how many times I’ve made different kinds of cupcakes and my family this vanilla cupcake over any other cupcakes! Even without frosting, it’s still really good! Whip up the batch of these deliciousness and try it for yourselves!"
            },
            {
                ref: "/recipe5-shimeizhang08",
                recipe_pic: "img/recipe5-shimeizhang08.jpg",
                recipe_name: "Strawberry Milkshake",
                recipe_desc: "I love having a strawberry milkshake during the summer but it is almost difficult to find a good one in restaurants. This is why I’ve decided to make my own! I want this milkshake to be smooth and creamy without overkilling the strawberries!"
            }
        ]
    });
});

app.post('/own-arrenantioquia', function(req,res) {
    res.render('profile', {
        title: "Arren Antioquia's Profile",
        profilepic: "img/arren.jpg",
        fullname: "Arren Antioquia",
        uname: "arrenantioquia",
        credibility: "MasterChef Winner",
        favorites: "431",
        recipes: [
            {
                ref: "/recipe1-arrenantioquia",
                recipe_pic: "img/recipe1-arrenantioquia.jpg",
                recipe_name: "Cheese Rolls",
                recipe_desc: "Ultra soft bread gets filled with melty cheese inside. You will love this sweet cheese rolls for your breakfast."
            },
            {
                ref: "/recipe2-arrenantioquia",
                recipe_pic: "img/recipe2-arrenantioquia.jpg",
                recipe_name: "Blueberry Cheesecake",
                recipe_desc: "Swirling blueberry puree into cheesecake batter isn't only beautiful, it's extremely delicious. The cheesecake stays extra-creamy and has the perfect tartness to it that will have you saying, 'just one more bite,' another thousand times."
            },
            {
                ref: "/recipe3-arrenantioquia",
                recipe_pic: "img/recipe3-arrenantioquia.jpg",
                recipe_name: "Caesar Salad",
                recipe_desc: "Classic Caesar Salad with crisp homemade croutons and a light caesar dressing – for when you want to impress your dinner guests."
            },
            {
                ref: "/recipe4-arrenantioquia",
                recipe_pic: "img/recipe4-arrenantioquia.jpg",
                recipe_name: "Filipino Pork Adobo",
                recipe_desc: "This Filipino dish is just like how grandma used to make. Make this in your own home and be taken back to your childhood! Pair this dish with rice and Sinigang and have it for dinner with your family!"
            },
            {
                ref: "/recipe5-arrenantioquia",
                recipe_pic: "img/recipe5-arrenantioquia.jpg",
                recipe_name: "Sangria",
                recipe_desc: "The BEST sangria recipe I've been able to hone to perfection! If you like a sweeter Sangria, use ginger ale in place of club soda. Sangria is an alcoholic beverage from Spain. It traditionally consists of red wine and chopped fruit, often with other ingredients or spirits."
            }
        ]
    });
});

app.post('/own-caiyohan', function(req,res) {
    res.render('profile', {
        title: "Yohan Cai's Profile",
        profilepic: "img/yohan.jpg",
        fullname: "Yohan Cai",
        uname: "caiyohan",
        credibility: "Kitchen Helper",
        favorites: "3",
        recipes: [
            {
                ref: "/recipe1-caiyohan",
                recipe_pic: "img/recipe1-caiyohan.jpg",
                recipe_name: "Bacon and Egg Instant Ramen",
                recipe_desc: "Sometimes you would want breakfast for dinner, and that's totally fine. But sometimes, after a long day, youâ€™re tired and you would want to quickly retire for the day. This recipe solves that - quick and easy breakfast for dinner meal? Yes please!"
            },
            {
                ref: "/recipe2-caiyohan",
                recipe_pic: "img/recipe2-caiyohan.jpg",
                recipe_name: "Ultimate Chocolate Chip Cookie",
                recipe_desc: "We named this recipe 'Ultimate Chocolate Chip Cookies,' because it’s got everything a cookie connoisseur could possibly ask for. With a texture that is slightly crispy on the outside and chewy on the inside."
            },
            {
                ref: "/recipe3-caiyohan",
                recipe_pic: "img/recipe3-caiyohan.jpg",
                recipe_name: "Deviled Eggs",
                recipe_desc: "One can never go wrong with the classic deviled eggs as an appetizer. It is such a simple dish yet a crowd-pleaser! Prepare days in advance or on the day itself, it remains so good!"
            },
            {
                ref: "/recipe4-caiyohan",
                recipe_pic: "img/recipe4-caiyohan.jpg",
                recipe_name: "Classic Waffles",
                recipe_desc: "A crispy fluffy waffle with a drizzle of maple syrup and fruits is the perfect way to start the morning! I have made this countless times in my mornings and it is still my go to breakfast."
            },
            {
                ref: "/recipe5-caiyohan",
                recipe_pic: "img/recipe5-caiyohan.jpg",
                recipe_name: "Corn Salad",
                recipe_desc: "This salad recipe is perfect for summer cookouts and family dinners. Serve this on the side with some meat and have the perfect meal with your loved ones! This salad recipe is so easy to put together and can be made ahead of time!"
            }
        ]
    });
});

app.use(express.static('public'));

//connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,

    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
     () =>{console.log('connected to DB!');
});

app.listen(port, function() {
    console.log('App listening at port '  + port)
});