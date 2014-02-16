
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Avalon/Resistance Game Tracker' });
};