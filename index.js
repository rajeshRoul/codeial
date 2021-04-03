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


// outdated
// const MongoStore = require('connect-mongo')(session);

// Updated library
var MongoDBStore = require('connect-mongodb-session')(session);

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));
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

// Use Express router
app.use('/', require('./routes/index'));


app.listen(port, function(err){
    if(err){
        console.log(`Error occurred while running server : ${err}`);
        return;
    }
    console.log(`Server is up and running on port : ${port}`);
})