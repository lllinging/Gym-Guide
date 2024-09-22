const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');
const Gym = require("../models/gyms");
const { addCollections } = require('../controllers/users');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const { storeReturnTo } = require('../middleware');

router.route('/register')
    .get(users.renderRegister)
    .post(upload.array('image'), catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    // passport.authenticate logs the user in and clears req.session
    // Now we can use res.locals.returnTo to redirect the user after login
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);


router.get('/logout', users.logout);

router.post('/toggle-favorite/:gymId', catchAsync(addCollections));

router.get('/myposts', async (req, res) => {
    console.log("myposts route");
    try {
        const user = await User.findById(req.user._id); 
        const gyms = await Gym.find({ _id: { $in: user.favorites } }); 
        console.log("gyms", gyms);
        console.log("user", user);
        res.render('users/myposts', { gyms });
    } catch (e) {
        console.error(e);
        res.redirect('/');
    }
});

module.exports = router;

