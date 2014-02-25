/*
 * Debug page containing a console allowing to send raw messages to the server.
 * Useful for debugging
 */

exports.main = function(req, res){
  res.render('debug', { "title" : "Avalon/Resistance Game Tracker" });
};