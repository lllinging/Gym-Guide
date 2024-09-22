const express = require('express');
const router = express.Router();
const gyms = require('../controllers/gyms');
const { addCollections } = require('../controllers/users');
const User = require('../models/user');
const { isLoggedIn, isAuthor, validateGym } = require('../middleware');

// purpose: to parse file data from the form. if we have a file in the form, we need to parse the file data from the form. otherwise, the req.body will be empty after the form is submitted
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const catchAsync = require('../utils/catchAsync');
const Gym = require('../models/gyms');

router.route('/')
    .get(catchAsync(gyms.index))
    .post(isLoggedIn, upload.array('image'), validateGym, catchAsync(gyms.createGym));

//get not post,order matters. if this is before /gyms/:id, it will be treated as id
//order matters. if this is before /gyms/:id, it will be treated as id
router.get('/new', isLoggedIn, gyms.renderNewForm);

router.route('/:id')
    .get(catchAsync(gyms.showGym))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateGym, catchAsync(gyms.updateGym))
    .delete(isAuthor, catchAsync(gyms.deleteGym));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(gyms.renderEditForm));

router.post('/toggle-favorite/:gymId', catchAsync(addCollections));

  
module.exports = router;