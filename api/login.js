const route = require('express').Router();
const bodyParser = require('body-parser');
const activedirectory = require('activedirectory');
const jwt = require('jwt-simple');
const mongoose = require('mongoose');
const accessConfig = require('../../config');
const userModel= require('./model/user');
const jsonParser = bodyParser.json()

route.post('/', jsonParser, function(req, res) {
	var data = req.body;
	var username = data.username;
	var password = data.password;
	var payload;
	var token;

	var adConfig = {
		baseDN: accessConfig.baseDN,
		url: accessConfig.url
	}
	var ad = new activedirectory(adConfig)

	ad.authenticate(username+"@southernct.edu", password, function(err, auth) {
		if (err && err.name === 'InvalidCredentialsError') {
			res.json({message: 'Incorrect Username or Password'});
		}
		else if (auth) {
			userModel.findOne({'username': data.username}, function(err, user){
				if(err) { console.log('mongoose ' + err) }
				else if(user) { // Known user logged in again
					token = jwt.encode(user, accessConfig.secret);
					payload = {
						jwt: token,
						user: user
					}
					res.json(payload);
				}
				else if(!data.name) { // new user with no details
					payload = {message: 'No User Found'}
					res.json(payload);
				}
				else { // new user with details
					var newUser = userModel({
						username: data.username,
						name: data.name,
						email: data.username+'@southernct.edu',
						primary_contact: data.primary_contact,
						hall: data.hall,
						jobs: [
							mongoose.Types.ObjectId('576157f4b82a57e418c31184'),
							mongoose.Types.ObjectId('577d1d51dcfd07716f7b80bf')
						]
					});

					newUser.save(function(err, user) {
						if(err) { console.log('newUser ' + err) }
						else {
							token = jwt.encode(user, accessConfig.secret);
							payload = {
								jwt: token,
								user: user
							}
							res.json(payload)
						}
					})
				}
			});
		}
	});
});

module.exports = route;