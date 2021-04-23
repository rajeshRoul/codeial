const User = require('../models/user');
const Friendship = require('../models/friendship');
const fs = require('fs');
const path = require('path');

// Load profile page
module.exports.profile = async function(req, res){
    let userTo = await User.findById(req.params.id);
    if(userTo){
        let friendship = await Friendship.findOne({
            user_from: req.user.id,
            user_to: userTo
        });
        if(friendship){
            return res.render('users_profile', {
                title : 'profile',
                profile_user: userTo,
                friend: 'Unfollow'
            });
        }else{
            return res.render('users_profile', {
                title : 'profile',
                profile_user: userTo,
                friend: 'Follow'
            });
        }
    }
    return res.render('users_profile', {
        title : 'profile',
        profile_user: userTo,
        friend: 'Error Fetching User Details'
    });
};

// Add or Remove Friend
module.exports.addFriend = async function(req, res){
    try{
        let friendship = await Friendship.findOne({
            user_from: req.user.id,
            user_to: req.params.id
        });
        let user = await User.findById(req.user.id);
        if(friendship){
            friendship.remove();
            user.friends.pull(req.params.id);
            if(req.xhr){
                return res.status(200).json({
                    button_text: "Follow",
                });
            }
        }else{
            await Friendship.create({
                user_from: req.user.id,
                user_to: req.params.id
            });
            user.friends.push(req.params.id);
            user.save();
            if(req.xhr){
                return res.status(200).json({
                    button_text: "Unfollow",
                });
            }
        }
        return res.redirect('back');
    }catch(err){
        console.log("error", err);
        return res.redirect('back');
    }
    
}

module.exports.update = async function (req, res) {
    
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){console.log('*****Multer Error:', err); return;}
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }

    }else{
        req.flash('error', 'Unauthiorzed!');
        return res.status(401).send('Unauthorized');
    }
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
            req.flash('success', 'You have signed up, login to continue!');
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