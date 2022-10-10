var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const jwt = require('jsonwebtoken');
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    console.log("token = "+token);
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.MY_TOKEN, (err, user) => {
      console.log(err)
  
      if (err) return res.sendStatus(403)
  
      req.user = user
  
      next()
    })
}

//const dotenv = require('dotenv');
//dotenv.config();

var indexRouter = require('./routes/index');
var bookRouter = require('./routes/book');
var studentRouter = require('./routes/student');
var userRouter = require('./routes/user');
var loginRouter = require('./routes/login');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use('/login', loginRouter);
app.use(authenticateToken);
app.use('/', indexRouter);
app.use('/book', bookRouter);
app.use('/student', studentRouter);
app.use('/user', userRouter);

module.exports = app;
