const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {campgroundSchema, reviewSchema } = require('./schemas.js')

const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/expressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user.js');
const campground = require('./models/campground');
const Review = require('./models/review.js');

const userRoutes = require('./routes/users.js');
const campgroundRoutes = require('./routes/campgrounds.js');
const reviewRoutes = require('./routes/reviews');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log('database connected');
}
main().catch(err => console.log(err));

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    secret:'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }  
}

app.use(session(sessionConfig));
app.use(flash());

//middleware required to initialize
app.use(passport.initialize());
//middleware to make persistent login session
app.use(passport.session());
//telling passport to use local strategy to authenticate
passport.use(new LocalStrategy(User.authenticate()));

//serialize is how you store user in session
passport.serializeUser(User.serializeUser());

//deserialize is how you retrieve user from session
passport.deserializeUser(User.deserializeUser());

app.use( (req,res,next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/',userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)

app.get('/', (req, res) => {
    res.render('home')
})




//for all 
app.all('*', (req,res,next)=>{
    next( new ExpressError('Page Not Found',404))
})

//dealing with error using error handler
app.use((err, req, res, next) => {
    const {statusCode=500} = err;
    if(!err.message) err.message="Oh No, something went wrong!"
    res.status(statusCode).render('error',{err});
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})
