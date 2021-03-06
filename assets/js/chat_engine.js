class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://localhost:5000', { transports: ['websocket', 'polling', 'flashsocket'] });
// http://54.210.58.227:5000
        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;
        this.socket.on('connect', function(){
            console.log('Connection established using sockets...!');
            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined:', data);
            });
        });

        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            if(msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);

            let newMessage = $('<li>');
            let messageType = 'received';
            if(data.user_email == self.userEmail){
                messageType = 'send';
            }
            newMessage.append($('<p>',{
                'html': data.message
            }));
            newMessage.append($('<small>',{
                'html': data.user_email
            }));

            newMessage.addClass(messageType);
            newMessage.attr('id', 'message');

            $('#chats').append(newMessage);
        });
    }
}


$('#chats-header').click(function(){
    $('#chats-container').toggleClass('chat-box-hide');
});