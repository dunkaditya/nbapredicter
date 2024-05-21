const express = require('express'), 
router = express.Router(),
passport = require('passport'),
mongoose = require('mongoose'),
User = mongoose.model('User');

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/', (req, res) => {
  if(req.user){
    res.redirect('/about');
  } else {
    res.redirect('/login');
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const {username, password} = req.body;
  User.register(new User({username}), password, (err) => {
    if (err) {
      res.render('register',{message:'Your registration information is not valid'});
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('about');
      });
    }
  });   
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if(user) {
      req.logIn(user, () => {
        res.redirect('/about');
    });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
});

module.exports = router;
