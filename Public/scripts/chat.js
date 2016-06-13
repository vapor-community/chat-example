function Chat(host) {
    var chat = this;

    chat.ws = new WebSocket('ws://' + host);
    chat.ws.onopen = function() {
        chat.askUsername();
    };

    chat.askUsername = function() {
        var name = prompt('What is your GitHub username?');

        $.get('https://api.github.com/users/' + name, function(data) {
            chat.join(name);
        }).fail(function() {
            alert('Invalid username');
            chat.askUsername();
        });
    }

    chat.imageCache = {};

    $('form').on('submit', function(e) {
        e.preventDefault();

        var message = $('.message-input').val();

        if (message.length == 0 || message.length >= 256) {
            return;
        }

        chat.send(message);
        $('.message-input').val('');
    });

    chat.ws.onmessage = function(event) {
        var message = JSON.parse(event.data);
        console.log('[' + name + '] ' + message);
        chat.bubble(message.message, message.username);
    }

    chat.send = function(message) {
        chat.ws.send(JSON.stringify({
            'message': message
        }));

        chat.bubble(message);
    }

    chat.bubble = function(message, username) {
        var bubble = $('<div>')
            .addClass('message')
            .addClass('new');

        if (username) {
            var lookup = username;

            if (lookup == 'Bot') {
                lookup = 'qutheory';
            }
            bubble.attr('data-username', lookup);

            var imageUrl = chat.imageCache[lookup];

            if (!imageUrl) {
                // async fetch and update the image
                $.get('https://api.github.com/users/' + lookup, function(data) {
                    if (data.avatar_url) {
                        imageUrl = data.avatar_url;
                    } else {
                        imageUrl = 'https://avatars3.githubusercontent.com/u/17364220?v=3&s=200';
                    }

                    $('div.message[data-username=' + lookup + ']')
                        .find('img')
                        .attr('src', imageUrl);

                    chat.imageCache[lookup] = imageUrl;
                });
            }

            var image = $('<img>')
                .addClass('avatar')
                .attr('src', imageUrl);

            bubble.append(image);
        }


        var text = $('<span>')
            .addClass('text');

        if (username) {
            text.text(username + ': ' + message);
        } else {
            bubble.addClass('personal');
            text.text(message);
        }


        bubble.append(text);

        var d = new Date()
        var m = '00'
        if (m != d.getMinutes()) {
            m = d.getMinutes();
        }

        if (m < 10) {
            m = '0' + m;
        }

        var time = $('<span class="timestamp">' + d.getHours() + ':' + m + '</div>');
        bubble.append(time);

        $('.messages').append(bubble);

        var objDiv = $('.messages')[0];
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    chat.join = function(name) {
        chat.ws.send(JSON.stringify({
            'username': name
        }));
    }
};
