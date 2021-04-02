module.exports.profile = function(req, res){
    return res.render('users_profile', {
        title : 'profile'
    });
};

module.exports.posts = function(req, res){
    return res.end('<h1>Users posts<h2>');
}

// User Sign in
module.exports.signIn = function(req, res){
    return res.render('user_sign_in', {
        title : 'Codeial | Sign In'
    })
}

// User Sign up
module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
        title : 'Codeial | Sign Up'
    })
}