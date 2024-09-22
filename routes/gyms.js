const express = require('express');
const router = express.Router();
const gyms = require('../controllers/gyms');
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

router.post('/toggle-favorite/:gymId', async (req, res) => {
    const userId = req.user._id; // Assuming you have user authentication middleware
    console.log("userId", userId);
    const gymId = req.params.gymId;
  
    try {
      const user = await User.findById(userId);
      console.log("user from toggle favorites", user);
      const isFavorite = user.favorites.includes(gymId);
      console.log("isFavorite", isFavorite);
  
      if (isFavorite) {
        user.favorites.pull(gymId);
      } else {
        user.favorites.push(gymId);
        console.log("pushed gymId to favorites");
      }
  
      await user.save();
      res.json({ success: true, isFavorite: !isFavorite });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error toggling favorite' });
    }
  });

  
module.exports = router;