const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {

    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        user.avatar = req.files ? req.files.map(f => ({ url: f.path, filename: f.filename })) : null;
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
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
  }

