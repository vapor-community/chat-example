var ws = new WebSocket("ws://vapor-chat.herokuapp.com/chat");

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
}
