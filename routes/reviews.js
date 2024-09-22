//why need to require express and router again? because we are in a different file now and we need to require express and router again in order to use them in this file 
const express = require('express');
const router = express.Router({ mergeParams: true });

const Gym = require('../models/gyms');
const Review = require('../models/review');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


//why need to change to router.get instead of app.get? because we are in a different file now and we need to change app.get to router.get in order to use it in this file
//router.get is a method that is used to handle get requests in express which is used to get the data from the server and display it in the browser. It is a middleware that is executed when a request is made to the server
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

//$pull is a mongodb operator that removes from an existing array all instances of a value or values that match a specified condition
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;