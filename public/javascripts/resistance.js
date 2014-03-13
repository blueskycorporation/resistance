var socket;
var myUserName;
var host = window.location.protocol+'//'+window.location.host;

socket = io.connect(host);


function getGamesList() {
    socket.emit('getGamesList', "list");
    console.log('Get games list');
}

function setCurrentGamesList(games) {
	
	//$('select#users >option').remove()
	$('gamesList').childElements().each(function(child){
		child.remove();
		
	});
	
	var i = 0;
	for(key in games){
		$('gamesList').insert("<li>" + games[key].type + "</li>");
		
		i = i + 1;
	}
}
 

socket.on('gamesList', function(data) {
	setCurrentGamesList(data)
});