const express = require('express');
const morgan = require('morgan')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose')
const passport = require('passport')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/tutoringwebsite')
const app = express()
app.use(morgan('dev'))
 
// 2 for views
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', expressHandlebars({ defaultLayout: 'layout' }))
app.set('view engine', 'handlebars')
 

// 3 for body parsing and cookies, sessions
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
// app.use('/public',express.static('public'))
const static = express.static(path.join(__dirname, '/public'))
app.use("/public",static)
const vendor = express.static(path.join(__dirname+'/vendor'))
app.use('/vendor',vendor)
app.use(session({
  key:'user_sid',
  cookie: { maxAge: 60000 },
  secret: 'codeworkrsecret',
  saveUninitialized: false,
  resave: false
}));


app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  next();
});

// 4 for flash messages
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_mesages = req.flash('success')
  res.locals.error_messages = req.flash('error')
  next()
})
 
// 5
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))

// 6
// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.render('notFound')
});
 
// 7
app.listen(5000 , () => console.log('Server started listening on port 5000!'))

module.exports = app
