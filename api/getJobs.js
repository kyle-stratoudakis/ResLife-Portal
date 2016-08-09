const route = require('express').Router();
const jwt = require('jwt-simple');
const accessConfig = require('../../config');
const jobModel = require('./model/job');

route.get('/', function(req, res) {
	var token = req.query.jwt;
	var decodedUser = jwt.decode(token, accessConfig.secret);
	var jobs = decodedUser.jobs;
	jobModel.find({ _id: { $in: jobs } })
	.populate({
		path: 'card_actions dash_actions endpoints',
		populate: {
			path: 'actions',
			populate: {
				path: 'endpoint'
			}
		}
	})
	.exec(function(err, jobDoc){
		if(err) {
			console.log('mongoose ' + err);
		}
		else {
			res.json(jobDoc);
		}
	})
});

module.exports = route;