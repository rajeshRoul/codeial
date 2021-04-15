const nodemailer = require('../config/nodemailer');

exports.newComment = (comment) => {
    console.log('Inside new comment mailer');
    nodemailer.transporter.sendMail({
        from: 'roul.rajesh28@gmail.com',
        to: comment.user.email,
        subject: "New Comment Published",
        html: '<h1>Hey, your comment is now published<h1>'
    }, (err, info)=> {
        if(err){console.log('Error in sending mail: ', err); return;}

        console.log('Message Sent : ', info);
        return;
    });
}