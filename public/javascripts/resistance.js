var socket;
var myUserName;
var host = window.location.protocol+'//'+window.location.host;

socket = io.connect(host);


function getGamesList() {
    socket.emit('getGameslist', "list");
    console.log('Get games list');
}

function setCurrentGamesList(currentGamesStr) {
    //$('select#users >option').remove()
	$('gamesList').childElements().each(function(child){
		child.remove();
		
	});
	
	JSON.parse(currentGamesStr).forEach(function(name) {
		
		$('gamesList').insert("<li>" + name + "</li>");
	});
}
 

socket.on('gamesList', function(data) {
	setCurrentGamesList(data.currentGames)
	
});