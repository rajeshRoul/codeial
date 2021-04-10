{
    let createComment = function(){
        let newCommentForm = $('#new-comment-form');
        newCommentForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type:'post',
                url: '/comments/create',
                data: newCommentForm.serialize(),
                success: function(data){
                    let newComment = newCommentDom(data.data.comment);
                    $(`#post-comments-${data.data.comment.post}`).prepend(newComment);
                },error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    };

    // Method to return a comment to be added in the dom
    let newCommentDom = function(comment){
        console.log(comment);
        return $(`<li>
        <p>
            <small>
                <a href="/comments/destroy/${ comment.id }"> X </a>
            </small>
            ${ comment.content }
            <br>
            <small>
            ${ comment.user.email }
            </small>
        </p>
    </li>`);
    };

    createComment();
}