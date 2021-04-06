const User = require('../models/user');

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('users_profile', {
            title : 'profile',
            profile_user: user
        });
    });
    
};

module.exports.update = function (req, res) {
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            if(err){console.log('Error in updating user details'); return;}
            return res.redirect('back');
        });
    }else{
        return res.status(401).send('Unauthorized');
    }
}

module.exports.posts = function(req, res){
    return res.end('<h1>Users posts<h2>');
}

// Render Sign in page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title : 'Codeial | Sign In'
    })
}

// Render Sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title : 'Codeial | Sign Up'
    })
}

// Get the sign up data
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email : req.body.email}, function(err, user){
        if(err){console.log('Error while finding user on sign up'); return;}
        if(!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in registering user'); return;}
                res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }
    });
}

// Sign in and create a session for user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

// Sogn Out and destroy session for user
module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have Logged Out');


    return res.redirect('/');
}