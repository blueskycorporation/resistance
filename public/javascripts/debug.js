var socket;
var host = window.location.protocol+'//'+window.location.host;
 
socket = io.connect(host);
 
function sendMessage() {
    socket.emit($('message').getValue(), $('data').getValue());
    $('console').insert('<p>' + $('message').getValue() + ' ' + $('data').getValue() + '</p>');
}

function appendData(data){
	$('console').insert('<p>' + data + '</p>');
}

socket.on('gameCreated', function(msg) {
    appendData('gameCreated' + msg);
  });

socket.on('user joined', function(msg) {
    appendData('user joined' + msg);
  });

socket.on('welcome', function(msg) {
    appendData('welcome' + msg);
  });

  $('message').keypress(function(e) {
      if (e.keyCode == 13) {
          sendMessage();
          e.stopPropagation();
          e.stopped = true;
          e.preventDefault();
      }
  });
  
  $('data').keypress(function(e) {
      if (e.keyCode == 13) {
          sendMessage();
          e.stopPropagation();
          e.stopped = true;
          e.preventDefault();
      }
  });
