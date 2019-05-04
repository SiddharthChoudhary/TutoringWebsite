var express = require('express');
var router = express.Router();
var session = require('express-session');

/* GET home page. */
router.get('/' , function(req, res, next) {
  if (req.session.user && req.cookies.user_sid) {
    res.render('index');
  } else {
    res.redirect('/login');
  }
  
});

module.exports = router;
