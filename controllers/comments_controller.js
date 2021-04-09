const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res){
    try{
        let currPost = await Post.findById(req.body.post);
        if(currPost){
            let newComment = await Comment.create({
                content : req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            currPost.comments.push(newComment);
            currPost.save();

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment: newComment
                    },
                    message: "Comment Added"
                });
            }

            req.flash('success', 'Comment Added');
            return res.redirect('/');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
}

module.exports.destroy = async function(req, res){
    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
            req.flash('success', 'Comment Removed');
            return res.redirect('back');
        }else{
            req.flash('error', 'You are not authorized to delete this comment');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}