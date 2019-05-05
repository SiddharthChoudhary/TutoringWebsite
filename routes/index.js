var express = require('express');
var router = express.Router();
var session = require('express-session');
//validation schema
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
      res.redirect('/');
      return;
  } else {
      next();
  }    
};
/* GET home page. */
router.get('/' , function(req, res, next) {
  if (req.session.user && req.cookies.user_sid) {
    res.render('index');
  } else {
    res.redirect('users/login');
  }
  
});

router.get('/dashboard',function(req,res,next){
  if(!req.session.user && !req.cookies.user_sid){
    res.redirect('users/login')
  }else{
    res.render('index')
  }
})
module.exports = router;
