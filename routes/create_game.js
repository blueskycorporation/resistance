/*
 * GET home page.
 */

exports.main = function(req, res){
  res.render('create_game', { title: 'Avalon/Resistance Game Tracker' });
};