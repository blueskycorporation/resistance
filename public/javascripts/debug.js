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
	data = JSON.parse(msg);
    appendData('gameCreated ' + JSON.stringify(data));
  });

socket.on('playerJoined', function(msg) {
	data = JSON.parse(msg);
    appendData('playerJoined ' + JSON.stringify(data));
  });

socket.on('welcome', function(msg) {
	data = JSON.parse(msg);
    appendData('welcome ' + JSON.stringify(data));
  });

socket.on('gamesList', function(msg) {
	
	data = JSON.parse(msg);
    appendData('gamesList ' + JSON.stringify(data));
  });
