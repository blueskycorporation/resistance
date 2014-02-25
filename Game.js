/* Class Game 
 * Represents a room created for a specific game
 */

// TODO add other game parameters: open/concealed plot cards, excalibur, oberon allowed if 10 people, etc...
module.exports = function Game(type, plotCards, lady)
{
	this.type = type;
	this.plotCards = plotCards;
	this.lady = lady;
}

// TODO create logic for rounds, etc... Probably a state pattern
// TODO add player into game, etc...