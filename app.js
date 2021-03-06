const express = require('express');
const morgan = require('morgan')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const hbs = require("handlebars");
const moment = require("moment");
const expressHbs = require("express-handlebars");
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose')
const helmet=require("helmet")
mongoose.Promise = global.Promise
const app = express()
const server = require("http").createServer(app);
const io = require("socket.io")(server);
app.use(morgan('dev'))
 
// 2 for views
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', expressHadlebars({ defaultLayout: 'loginLayout' }))
app.engine('handlebars', expressHandlebars({ defaultLayout: 'dashboardLayout' }))
app.engine(" handlebars", expressHbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

 

// 3 for body parsing and cookies, sessions
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// app.use('/public',express.static('public'))
const static = express.static(path.join(__dirname, '/public'))
app.use("/public",static)
const vendor = express.static(path.join(__dirname+'/vendor'))

const port = process.env.PORT || 3000;

app.use('/vendor',vendor)


app.use(session({
  key:'user_sid',
  cookie: { maxAge: 20 * 60000 },
  secret: 'codeworkrsecret',
  saveUninitialized: false,
  resave: false
}));

hbs.registerHelper("formatDate", (date) => {
    return moment(date).format("MMMM Do YYYY, h:mm a");
});


// 4 for flash messages
app.use(flash())
app.use(helmet())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success')
  res.locals.error_messages = req.flash('error')
  next()
})


app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  next();
});



mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tutoringwebsite', {useNewUrlParser: true },(err, db) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log("Connected to database");
    app.use("/forum", require("./routes/forum")(db));
    require("./socket/index")(io, db);
    app.use('/', require('./routes/users'))
    app.use('/users',require('./routes/logins'))
    app.use('/calendar',require('./routes/events'));
    app.use('/checkInbox',require('./routes/ajaxInbox'));
    app.use('/tutors',require('./routes/tutors'));
    app.use('/about',(req,res,next)=>{
      if(req.session.user){
      res.render('aboutUs', {layout: false})
      } else{res.redirect("/")}
    })
    app.use(express.static(path.join(__dirname, "./public")));
    // app.use('/vendor', express.static(path.join(__dirname+'./vendor')));
    app.use("/topics", require("./routes/topics")(db));
    app.use("/comments", require("./routes/comments")(db));
    app.use("/categories", require("./routes/categories")(db));
    app.use("*",(req, res, next) => {
      res.render('partials/notFound',{layout:false})
    });

    server.listen(port, () => {
        console.log("Listening on port", port);
    });
});
module.exports=app