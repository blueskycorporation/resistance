 
exports.verify = function(req, res, next){
	// If the client has not logged in, redirection to the login page
	console.log('Session username: ' + req.session.username);
	if(req.session.username == undefined){
		res.render('login', { title: 'Avalon/Resistance Game' });
	}
	// Else, execute the usual function
	else{
		next();
	}
}