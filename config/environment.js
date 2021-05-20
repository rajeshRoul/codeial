const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'roul.rajesh28@gmail.com',
            pass: '...'
        }
    },
    google_client_id: "583285833227-3vbn1vf5pm61le3ove4rcdaunb4s0qe8.apps.googleusercontent.com",
    google_client_secret: "mDDtwVgISw8Cff8cNVxwitay",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    asset_path: process.env.PINGME_ASSET_PATH,
    session_cookie_key: process.env.PINGME_SESSION_COOKIE_KEY,
    db: process.env.PINGME_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.PINGME_GMAIL_USERNAME,
            pass: process.env.PINGME_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.PINGME_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.PINGME_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.PINGME_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.PINGME_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}


module.exports = eval(process.env.NODE_ENV) == undefined ? development : eval(process.env.NODE_ENV);