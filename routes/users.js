const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin )
//authenticate using local strategy and on failure flash msg and redirect to login page
// use the storeReturnTo middleware to save the returnTo value from session to res.locals
// passport.authenticate logs the user in and clears req.session
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),users.login)

router.get('/logout', users.logout);

module.exports = router;