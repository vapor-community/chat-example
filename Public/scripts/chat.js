function Chat(host) {
    var chat = this;

    chat.ws = new WebSocket('ws://' + host);
    chat.ws.onopen = function() {
        var name = prompt('What is your GitHub username?');
        chat.join(name);
    };

    chat.images = {};

    $('form').on('submit', function(e) {
        e.preventDefault();

        var message = $('.message-input').val();
        chat.send(message);
        $('.message-input').val('');
    });

    chat.ws.onmessage = function(event) {
        var message = JSON.parse(event.data);

         var bubble = $('<div>')
            .addClass('message')
            .addClass('new');

        var imageUrl = chat.images[message.username];

        bubble.attr('data-username', message.username);

        if (!imageUrl) {
            var username = message.username;

            if (username == "Bot") {
                username = "qutheory";
            }

            $.get('https://api.github.com/users/' + username, function(data) {
                $('div.message[data-username=' + message.username + ']').find('img').attr('src', data.avatar_url);
                chat.images[message.username] = data.avatar_url;
                console.log(chat.images);
            });
        }

        var image = $('<img class="avatar">');
        image.attr('src', imageUrl);
        bubble.append(image);


        var text = $('<span class="text">')
            .text(message.username + ': ' + message.message);
        bubble.append(text);

        var time = $('<span class="timestamp">19:46</div>');
        bubble.append(time);

        $('.messages').append(bubble);
        console.log('[' + name + '] ' + message);

        var objDiv = $('.messages')[0];
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    chat.send = function(message) {
        chat.ws.send(JSON.stringify({
            'message': message
        }));

        var bubble = $('<div>')
            .addClass('message')
            .addClass('personal')
            .addClass('new');

        var text = $('<span class="text">')
            .text(message);
        bubble.append(text);

        var time = $('<span class="timestamp">19:46</div>');
        bubble.append(time);

        $('.messages').append(bubble);
    }

    chat.join = function(name) {
        chat.ws.send(JSON.stringify({
            'username': name
        }));
    }
};
    
    /*
    ws.onopen = function()
    {
        websocketIsOpen();
    };

    ws.onmessage = function (evt)
    {
         var received_msg = evt.data;
         addMessage(received_msg);
    };

    ws.onclose = function()
    {
         // websocket is closed.
         alert("Unexpectedly disconnected, please reload your page");
    };

    var $messages = $('.messages-content'),
            d, h, m,
            i = 0;

    function websocketIsOpen() {
        hideMessageLoading();
        addMessage("You have joined the room 👋");
    }

    $(window).load(function() {
        $messages.mCustomScrollbar();
        setTimeout(function() {
            switch (ws.readyState) {
                case 0:
                    showMessageLoading();
                    break;
                case 1:
                    websocketIsOpen();
                    break;
                default:
                    alert("Fialed to connect");
                    break;
            }
        }, 100);
    });

    function updateScrollbar() {
        $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
            scrollInertia: 10,
            timeout: 0
        });
    }

    function setDate(){
        d = new Date()
        if (m != d.getMinutes()) {
            m = d.getMinutes();
            $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
        }
    }

    function insertMessage() {
        msg = $('.message-input').val();
        ws.send(msg)

        if ($.trim(msg) == '') {
            return false;
        }
        $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
        setDate();
        $('.message-input').val(null);
        updateScrollbar();
    }

    $('.message-submit').click(function() {
        insertMessage();
    });

    $(window).on('keydown', function(e) {
        if (e.which == 13) {
            insertMessage();
            return false;
        }
    })

    function fakeMessage() {
        if ($('.message-input').val() != '') {
            return false;
        }
        showMessageLoading();

        setTimeout(function() {
            addMessage("HI");
            i++;
        }, 1000 + (Math.random() * 20) * 100);

    }

    function showMessageLoading() {
        $('<div class="message loading new"><figure class="avatar"><img src="https://avatars3.githubusercontent.com/u/17364220?v=3&s=200" /></figure><span></span></div>').appendTo($('.mCSB_container'));
        updateScrollbar();
    }

    function hideMessageLoading() {
        $('.message.loading').remove();
    }

    function addMessage(msg) {
        hideMessageLoading();
        $('<div class="message new"><figure class="avatar"><img src="https://avatars3.githubusercontent.com/u/17364220?v=3&s=200" /></figure>' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
        setDate();
        updateScrollbar();
    }*/    
