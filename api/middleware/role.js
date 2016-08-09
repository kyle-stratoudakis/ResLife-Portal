var accessConfig = require('../../../config');
var jwt = require('jwt-simple');
var jobModel = require('../model/job');

const role = function(req, res, next) {
	var userJwt;
	var jobId;

	// Check for request body from JSONparser
	if(req.body) {
		// POST requests store data in request body
		userJwt = req.body.jwt;
		jobId = req.body.jobId;
	}
	else {
		// GET requests store data in request query
		userJwt = req.query.jwt;
		jobId = req.query.job;
	}

	req.decodedUser = jwt.decode(userJwt, accessConfig.secret);
	var userJobs = req.decodedUser.jobs;

	// No action taken if jobId not in userJobs
	for(var job of userJobs) {
		if(job === jobId) {
			jobModel
			.findOne({'_id': jobId}, {'role': 1})
			.exec(function(err, roleDoc) {
				if(err){
					console.log(err);
				}
				else {
					if(roleDoc) {
						req.decodedUser.role = roleDoc.role;
					}
					else {
						// Currently unused in any subsequent data query
						req.decodedUser.role = 'none';
					}
					next();
				}
			});
		}
	}
}

module.exports = role;