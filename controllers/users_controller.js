module.exports.profile = function(req, res){
    return res.render('users_profile', {
        title : 'profile'
    });
};

module.exports.posts = function(req, res){
    return res.end('<h1>Users posts<h2>');
}

// Render Sign in page
module.exports.signIn = function(req, res){
    return res.render('user_sign_in', {
        title : 'Codeial | Sign In'
    })
}

// Render Sign up page
module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
        title : 'Codeial | Sign Up'
    })
}

// Get the sign up data
module.exports.create = function(req, res){
    // TODO later
}

// Sign in and create a session for user
module.exports.createSession = function(req, res){
    // TODO later
}