var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ 
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB (adjust as needed)
  }
});

const dotenv=require('dotenv').config();
if (dotenv.error){
  throw dotenv.error;
}
console.log(process.env.JWT_PASSWORD);



const connectDb = require('./Config/db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authRouter = require('./routes/authRouter');
const adminRouter = require('./routes/adminRoute');
const paymentRoutes=require('./routes/paymentRoutes');

//const checkTimeSlotRouter=require('./routes/checkTimeSlot')
var app = express();

connectDb();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// Middleware
app.use(cors({ origin: ['https://bookyourturff-frontend.onrender.com','http://localhost:3000']}));
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/payment',paymentRoutes)
/*const corsOptions ={
  origin:'http://localhost:3000/', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;