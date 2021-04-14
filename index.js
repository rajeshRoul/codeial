const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

// Used for session cookies
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

// outdated
// const MongoStore = require('connect-mongo')(session);
// Updated library
var MongoDBStore = require('connect-mongodb-session')(session);

// Sass middleware
const sassMiddleware = require('node-sass-middleware');

// For flash messages
const flash = require('connect-flash');
// custom middleware to set flash messages
const customMware = require('./config/middleware');

app.use(sassMiddleware({
    src : './assets/scss',
    dest : './assets/css',
    debug : true,
    outputStyle : 'extended',
    prefix : '/css'
}));


app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));
// make the uploads path available to browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayouts);

// Extract styles and scripts from sub pages to layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name : 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave : false,
    cookie : {
        maxAge: (1000 * 60 * 100)
    },
    store:new MongoDBStore(
        {
        mongooseConnection: db,
        autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// Use Express router
app.use('/', require('./routes'));


app.listen(port, function(err){
    if(err){
        console.log(`Error occurred while running server : ${err}`);
        return;
    }
    console.log(`Server is up and running on port : ${port}`);
})