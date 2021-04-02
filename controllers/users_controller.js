module.exports.profile = function(req, res){
    return res.render('users_profile', {
        title : 'profile'
    });
};

module.exports.posts = function(req, res){
    return res.end('<h1>Users posts<h2>');
}