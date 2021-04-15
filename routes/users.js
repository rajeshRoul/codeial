const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);


router.get('/sign-in', usersController.signIn);

router.get('/sign-up', usersController.signUp);

router.post('/create', usersController.create);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'}
), usersController.createSession);

// use passport logout for signing out user
router.get('/sign-out', usersController.destroySession);


// Google authentication using passport
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google authentication callback
router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/users/sign-in'
}), usersController.createSession);

module.exports = router;