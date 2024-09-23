const dotenv = require('dotenv');

// Config
dotenv.config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const userRoutes = require('./routes/users');
const User = require('./models/user');
const gyms = require('./routes/gyms');
const reviews = require('./routes/reviews');
const helmet = require('helmet');

const mongoSAnitize = require('express-mongo-sanitize');

mongoose.connect('mongodb://localhost:27017/gym-guide');//other parameters can be added to the connect method

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
//to serve static files
app.set('view engine', 'ejs');
//in order to use the views folder
app.set('views', path.join(__dirname, 'views'));

// req.body will be undefined if you don't have this line of code. we need to parse the body of the request using the following code:
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));//_method is the key that we are looking for in the query string
app.use(express.static(path.join(__dirname, 'public')));//to serve static files
app.use(mongoSAnitize({ replaceWith: '_' }));//this is a middleware that will remove any $ or . from the request. it will prevent no sql injection

const scriptSrcUrls = [
    "https://www.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];

const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://*.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];

const fontSrcUrls = ["https://cdn.jsdelivr.net"
];

app.use(
    helmet.contentSecurityPolicy({
        useDefaults: false,
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: ["'none'"],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dwkdvav2l/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

const sessionConfig = {
    name: 'session', //name of the cookie to avoid the default name which is connect.sid to protect our app from attacks
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,//this is a security feature that helps prevent cross site scripting attacks. it means that the cookie cannot be accessed using javascript. it is only accessible via http protocol. 
        // secure: true,//this is a security feature that is used for https. it means that the cookie will only be set if we are using https. it is a secure cookie    
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}
app.use(session(sessionConfig));
app.use(flash());

//passport configuration, passport.initialize() is a middleware that is required to initialize passport. passport.session() is a middleware that is required to persist login sessions. passport.session() will alter the req object and change the 'user' value that is currently the session id (from the client cookie) into the true deserialized user object. 
app.use(passport.initialize());

//this is going to set up passport to use sessions to keep track of users

app.use(passport.session());
//LocalStrategy is used for username and password authentication. This module lets you authenticate using a username and password in your Node.js applications. By plugging into Passport, local authentication can be easily and unobtrusively integrated into any application or framework that supports Connect-style middleware, including Express.
//this  going to saying to passport, we are going to use local  strategy taht we have download and required and for the local strateyg, we are going to use the User.authenticate() method that comes from user model. it is called authenticate and it is a static method that comes from passport local mongoose
passport.use(new LocalStrategy(User.authenticate()));

//how to store and unstore it in the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this is a middleware that will run for every single request. it will run for every single request and it will set a local variable called success and error. so that we can use them in our templates
//res.locals.success we hacve access to this in our templates automatically and we do not have to pass it in every single render call. that's why we set up a middleware. //on every single request, i am putting it before our route handler. on every single one, we are going to take whatever is in the flash success and error and have access to it in our locals under the key success and error
app.use(async (req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//adding new reviews not work. because when you're working with the xpress router. express.router likes to keep param separate. so over here, wr are saying there is an ID in the browse, in the path that prefixes all of these routes. by default, we do not have access to that ID in our reviews routes. routers get separete params and they are separate. but we can specify an option that says merge params: true. so that way, we can have access to the ID that is in the path that prefixes all of these routes
app.use('/', userRoutes);
app.use('/gyms', gyms);
app.use('/gyms/:id/reviews', reviews);

app.get('/', (req, res) => {
    res.render('home');
});


app.all('*', (req, res, next) => {
    //next wwll pass the error to the next middleware to handle it, to the generic error handler app.use((err, req, res, next) => {})
    next(new ExpressError('Page Not Found', 404));
})

//basic error handler: if we have an error in the previous middleware, this middleware will run
//if we ever want to make it onto this actual route handler, ,if we ever wanna make it into here
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;//default values
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });

});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});