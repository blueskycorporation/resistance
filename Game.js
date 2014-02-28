/* Class Game 
 * Represents a room created for a specific game
 */

// TODO add other game parameters: open/concealed plot cards, excalibur, oberon allowed if 10 people, etc...


function Game(type, plotCards, lady)
{
	this.type = type;
	this.plotCards = plotCards;
	this.lady = lady;
	this.players = {};
}
module.exports.Game = Game;

Game.prototype.addPlayer = function(name, socketId){

	this.players[name] = socketId;
}

Game.prototype.removePlayer = function(){
	this.players[name] = null;
	
}

Game.prototype.getPlayerList = function(){

	return this.players;
}

// TODO create logic for rounds, etc... Probably a state pattern