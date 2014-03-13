/*******************************************************************************
 * 
 * Server initialization
 * 
 ******************************************************************************/


/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var socketio = require('socket.io');
var MemoryStore = express.session.MemoryStore,
	sessionStore = new MemoryStore();

// Screens
var routes = require('./routes');
var user = require('./routes/user');
var create_game = require('./routes/create_game');
var chat = require('./routes/chat');
var debug = require('./routes/debug');
var login = require('./routes/login');
var player = require('./routes/player');
var runninggame = require('./routes/runninggame');

// Libraries
var credentials = require('./credentials');

/**
 * External classes
 */

var Game = require('./Game.js').Game;

/**
 * Create server instance
 */

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var server = app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
var io = socketio.listen(server);

/**
 *  Configure app for sessions
 */

app.configure(function () {
    app.use(express.cookieParser());
    app.use(express.session({store: sessionStore
        , secret: 'secret'
        , key: 'express.sid'}));
    
});

var cookie = require('cookie');
var connect = require('connect');
var Session = connect.middleware.session.Session;

// override handshake to store session
io.set('authorization', function (data, accept) {
	if (data.headers.cookie) {
		data.cookie = connect.utils.parseSignedCookies(cookie.parse(decodeURIComponent(data.headers.cookie)),'secret');
		data.sessionID = data.cookie['express.sid'];
		// save the session store to the data object 
		// (as required by the Session constructor)
		data.sessionStore = sessionStore;
		sessionStore.get(data.sessionID, function (err, session) {
			if (err || !session) {
				accept('Error', false);
				
			} else {
				// create a session object, passing data as request and our
				// just acquired session data
				data.session = new Session(data, session);
				accept(null, true);
			}
		});
	} else {
		return accept('No cookie transmitted.', false);
	}
});


/**
 * Configure app
 */
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Configure routes
 * 
 * app.get(path, middlewareFnction, function)
 * path is the query path
 * middlewareFunction receives the function object and decides to execute it according to the user credentials.
 * function is an object referring to the appropiate file in '/routes'
 */
app.get('/', credentials.verify, routes.index);
app.get('/create_game', credentials.verify, create_game.main);
app.get('/users', credentials.verify, user.list);
app.get('/chat', credentials.verify, chat.main);
app.get('/debug', credentials.verify, debug.main);
app.get('/login', credentials.verify, login.main);
app.get('/player', credentials.verify, player.main);
app.get('/runninggame', credentials.verify, runninggame.main);
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// List of clients connected to the server.
// clients[i] contains the sessionID of the client i.
var clients = {};

/*******************************************************************************
 * 
 * Event functions.
 * These functions are called when the server receives a message from a client.
 * 
 ******************************************************************************/


// When a client connects to the server
io.sockets.on('connection', function(socket) {
	
	var hs = socket.handshake;
	console.log('A socket with sessionID ' + hs.sessionID + ' connected!');
	
	// setup an inteval that will keep our session fresh
	var intervalID = setInterval(function () {
		// reload the session (just in case something changed,
		// we don't want to override anything, but the age)
		// reloading will also ensure we keep an up to date copy
		// of the session with our connection.
		hs.session.reload( function () { 
			// "touch" it (resetting maxAge and lastAccess)
			// and save it back again.
			hs.session.touch().save();
		});
	}, 60 * 1000);
	
	/* The client wants to know the list of current games */
	socket.on('getGamesList', function(data){
		
		console.log('Sending games list');
		
		sendGamesList(socket);
		//socket.emit('gamesList', {"currentGames": JSON.stringify(Object.keys(games))});
		//TODO send games list
		//socket.emit('gamesList', '[{"type":"Resistance", "host":"John"},{"type":"Avalon", "host":"Bob"}]');
	});
	
	/* Create a game */
	socket.on('createGame', function(msg){
		
		data = JSON.parse(msg);
		
		console.log('create game  : ' + data.type + ' ' + data.plotCards + ' ' + data.lady);
		//TODO bug: games.length appears to be undefined
		games[games.length] = new Game(data.type, data.plotCards, data.lady);
		
	});
	
	/* 
	 * When a player logs into the server 
	 */
	socket.on('login', function(data){
		
		var username = data.username
		
		// If valid username
		if(username != null){
			
			// If not already taken
			if(testUsernameUnicity(username)){
		
				// Store player
				clients[hs.sessionID] = username;
				hs.session.username = username;
				hs.session.save();
				
				//TODO notify other players too
				sendLoginResult(socket, 0);
				console.log('Player joined server: ' + hs.session.username);
			}
			else{
				sendLoginResult(socket, 100);
				console.log('Player already existing: ' + username);
			}
		}
		else{
			sendLoginResult(socket, 101);
			console.log('Invalid username: ' + username);
		}
		
	});
	
	//TODO handle client disconnection
	/*
  socket.on('disconnect', function() {
    var uName = socketsOfClients[socket.id];
    delete socketsOfClients[socket.id];
    delete clients[uName];
 
    // relay this message to all the clients
 
    userLeft(uName);
  })*/
});


/*******************************************************************************
 * 
 * send functions.
 * These functions are called when the server sends a message to a client.
 * 
 ******************************************************************************/

/** 
	* Notify client of the login result
	* 0:	success
	* 100:	username already in use
	* 101: username invalid
	*/
function sendLoginResult(socket, status){
	socket.emit('loginResult', { "status": status });
}

/**
	* Send games in progress to client
	*/
function sendGamesList(socket){
	
	result = {};
	
	var i = 0;
	for(key in games){
		result[i] = {"host": games[key].getHost(),"type": games[key].getType()};
	
		i = i + 1;
	}
	
	socket.emit('gamesList', result);
}




/*******************************************************************************
 * 
 * Utility functions
 * The rest of the logic.
 * May be moved in the future for more clarity
 * 
 ******************************************************************************/


/**
 * Test if username is already taken.
 * @param username username to test
 * @return true if usernae is unique, false if username is already taken
 */
function testUsernameUnicity(username){
	var taken = false;
	for(sessionId in clients){
		if(clients[sessionId] == username){
			taken = true;
		}
	}
	
	return !taken;
}


var games = {}


// Create fake games list to test.
// The first parameter should be the username of the player creating the game.
// Since these are dummy examples, ADMIN is considered as the user name.
games[0] = new Game('ADMIN', 'Resistance', true, false);
games[1] = new Game('ADMIN', 'Resistance', false, true);
games[2] = new Game('ADMIN', 'Avalon', false, true);

//Player Interaction
//We will keep all of the player interactions here.
//Votes, Missions, Mission players
//Server Sets Game State
//--Tells Each Player What Their Required Action is
//1)Player Joins Game
//2)Player Nominates Team Members
//3)Leader Calls for Vote
//4)Player Votes on Team
//5)Player Plays Mission Card
//6)Leader Assigns Plot Cards(if in play)
//7)Leader Plays Lady(if in play)

