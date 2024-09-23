const User = require('../models/user');
const Gym = require('../models/gyms');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {

    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        user.avatar = req.files.length > 0 ? req.files.map(f => ({ url: f.path, filename: f.filename })) : [{ url: "/pictures/avatars/1.jpg", filename: "default-avatar" }];
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Gym Guide!');
            res.redirect('/gyms');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/gyms'; // update this line to use res.locals.returnTo now
    //purpose: to remove the returnTo value from res.locals after redirecting
    delete res.locals.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/gyms');
    });
}

module.exports.addCollections = async (req, res) => {
    const userId = req.user._id; // Assuming you have user authentication middleware
    const gymId = req.params.gymId;
  
    try {
      const user = await User.findById(userId);
      const isFavorite = user.favorites.includes(gymId);
  
      if (isFavorite) {
        user.favorites.pull(gymId);
      } else {
        user.favorites.push(gymId);
      }
  
      await user.save();
      res.json({ success: true, isFavorite: !isFavorite });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error toggling favorite' });
    }
  }

  module.exports.viewMyCollections = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); 
        const gyms = await Gym.find({ _id: { $in: user.favorites } }); 
        res.render('users/myCollections', { gyms });
    } catch (e) {
        console.error(e);
        res.redirect('/');
    }
}

module.exports.viewMyPosts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('posts'); 
        const gyms = user.posts; 
        res.render('users/myposts', { gyms });
    } catch (e) {
        console.error(e);
        res.render('/myProfile', { user });
    }
}

module.exports.updateDescription = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.description = req.body.description;
        await user.save();
        req.flash('success', 'Description updated!');
        res.redirect('/myProfile');
    } catch (e) {
        console.error(e);
        req.flash('error', 'Could not update description.');
        res.redirect('/myProfile');
    }
}

