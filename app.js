// Start server

var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8124);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}


// Start connection with client
io.sockets.on('connection', function (socket){
	//socket.emit('news', { hello: 'world' });
	
	
	// When a player joins
	socket.on('join', function (name) {
		// store the info
		socket.set('nickname', name, function(){
			//then once the info is stored, it has to be retrieved to be sent to other players and to send the confirmation
			socket.get('nickname', function (err, name) {
				socket.emit('joinSuccess', name);
				broadcastNewPlayer(name);
			});
			
			
		});
	});
	
	
	
	// When we receive a vote from a player
	socket.on('vote', function (from, vote){
		console.log('Open vote from ', from, ': ', vote);
		io.sockets.emit('voteFrom', { from: from, vote: vote});
		
	});
	
	
	socket.on('my other event', function (data) {
		console.log(data);
		
	});
	
});
	
	
function broadcastNewPlayer(name){

	io.sockets.emit('newPlayer', name);
	
}
	