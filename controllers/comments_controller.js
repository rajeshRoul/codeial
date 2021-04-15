const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');

module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await Comment.create({
                content : req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();

            if(req.xhr){
                let newComment = await Comment
                .populate(comment, {
                    path: 'user',
                    select: 'email'
                });
                commentsMailer.newComment(newComment);
                return res.status(200).json({
                    data: {
                        'comment': newComment
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
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "comment deleted"
                });
            }
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