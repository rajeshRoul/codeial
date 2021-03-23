module.exports.profile = function(req, res){
    return res.end('<h1> Users Profile <h1>');
};

module.exports.posts = function(req, res){
    return res.end('<h1>Users posts<h2>');
}