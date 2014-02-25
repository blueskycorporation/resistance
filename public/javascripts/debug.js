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

socket.on('gamesList', function(msg) {
    appendData('gamesList' + msg);
  });
