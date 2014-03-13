var socket;
//var myUserName;
var host = window.location.protocol+'//'+window.location.host;

socket = io.connect(host);

function login() {
	var username = $('input#username').val();
    socket.emit('login', {"username":username});
    console.log('login request with username ' + username);
}

function setFeedback(message) {
  $('span#feedback').html(message);
}
 

socket.on('loginResult', function(data) {
	
	var result = data.status;
	
	if(result == 0){
	
		setFeedback("success");
		
	}
	else if(result == 100){
		// USERNAME already used
		setFeedback("username already used");
	}
	else if(result == 101){
		// USERNAME already used
		setFeedback("username is invalid");
	}
	else{
		// Unrecognized status
		setFeedback("Unrecognized message");
	}
	
});