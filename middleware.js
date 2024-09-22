const { gymSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Gym = require('./models/gyms.js');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {//req.isAuthenticated() method is provided by passport, it returns true if the user is logged in, otherwise it returns false
        
        //store the url they are requesting
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }

    next();
    
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

//middleware to validate the gym
module.exports.validateGym = (req, res, next) => {
    //{error} : because result.error.detail is an array. we need .turn it into a tring and join together.. we are destructuring the result object and getting the error property from it
    //gymSchema.validate is a method that is provided by joi that will validate the data that we pass in against the schema that we defined in the gymSchema object in schemas.js file
    //joi is a library that allows us to define a schema for the data that we are expecting to get from the user        
    const {error} = gymSchema.validate(req.body);
    //if there is an error, we want to throw an error to
    //because we are in an async function, we need to throw an error to the catchAsync function and then handle it in the catchAsync function and to app.use((err, req, res, next) => {}) 

    if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400);
    } else {
    next();//if there is no error, we want to move on to the next middleware,important part 
    }
    }

    //middleware to check if the user is the author of the gym
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const gym = await Gym.findById(id);
    //this logic is to prevent someone from editing a gym through ajax or postman
    if (!gym.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/gyms/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    //this logic is to prevent someone from editing a gym through ajax or postman
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/gyms/${id}`);
    }
    next();
}


module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400);
    } else {
    next();
    }
}
