const route = require('express').Router();
const mongoose = require('mongoose');
const techRequestModel= require('../model/techRequest');
const jobModel= require('../model/job');
const userModel= require('../model/user');
const endpointModel= require('../model/endpoint');
const actionModel= require('../model/action');
const m_notif = require('../services/email/notifications');
const m_role = require('../middleware/role');
const m_administratorQueries = require('../middleware/techSupportQueries');
const getSearchId = require('../utils/getSearchId');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// requires m_role
route.post('/post/create/user', jsonParser, function(req, res, next) {
	var data = req.body.data;

	userModel.find({username: data.username}, function(err, user) {
		if(!err && !user) {
			var newUser = new userModel({
				name: data.name,
				username: data.username,
				email: data.email,
				primary_contact: data.primary_contact,
				notifRoles: data.notifRoles,
				notifTimes: data.notifTimes,
				jobs: data.jobs.map((job) => mongoose.Types.ObjectId(job._id))
			});

			newUser.save(function(err, saved) {
				if(!err) {
					res.status(200).json(saved._id);
					req.workorder = saved;
					next();
				}
				else {
					res.status(500).send(err);
					console.log(err)
				}
			});
		}
		else if(err) {
			res.status(500).send(err);
			console.log(err)
		}
	})
	
});

route.put('/put/update/user', jsonParser, function(req, res, next) {
	var data = req.body.data;
	var formId = req.body.formId;
	userModel.findOne({_id: formId}, function(err, user) {
		user.name = data.name;
		user.username = data.username;
		user.email = data.email;
		user.primary_contact = data.primary_contact;
		user.notifRoles = data.notifRoles;
		user.notifTimes = data.notifTimes;
		user.jobs = data.jobs.map((job) => mongoose.Types.ObjectId(job._id));
		user.banned = data.banned;

		user.save(function(err, saved) {
			if(!err) {
				res.status(200).json(saved._id);
				req.workorder = saved;
				next();
			}
			else {
				res.status(500).send(err);
				console.log(err)
			}
		});
	})
});

route.get('/get/details/user', function(req, res, next) {
	// return user by id
	if(req.query.jwt) {
		var id = req.query.id;
		userModel.findOne({ '_id': id })
		.populate({
			path: 'jobs',
			model: jobModel
		})
		.lean()
		.exec(function(err, user) {
			if(!err) {
				if(user === null) user = {};
				res.json(user);
			}
			else {
				console.log(err);
			}
		});
	}
});

route.post('/post/create/job', jsonParser, function(req, res, next) {
	// save job and all nested data
	var data = req.body.data;
	var newJob = new jobModel({
		title: data.title,
		subTitle: data.subTitle,
		role: data.role,
		link: data.link,
		note: data.note,
		endpoints: data.endpoints.map((endpoint) => mongoose.Types.ObjectId(endpoint._id)) || [],
		card_actions: data.card_actions.map((action) => mongoose.Types.ObjectId(action._id)) || [],
		dash_actions: data.dash_actions.map((endpoint) => mongoose.Types.ObjectId(action._id)) || []
	});

	newJob.save(function(err, saved) {
		if(!err) {
			res.status(200).json(saved._id);
			req.workorder = saved;
			next();
		}
		else {
			res.status(500).send(err);
			console.log(err)
		}
	});
});

route.put('/put/update/job', jsonParser, function(req, res, next) {
	// save job and all nested data
	var data = req.body.data;
	var formId = req.body.formId;
	jobModel.findOne({_id: formId}, function(err, job) {
		job.title = data.jobTitle;
		job.subTitle = data.jobTitle;
		job.role = data.jobRole;
		job.link = data.jobLink;
		job.note = data.JobNote;
		if(data.endpoints) job.endpoints = data.endpoints.map((endpoint) => mongoose.Types.ObjectId(endpoint._id));
		if(data.cardActions) job.card_actions = data.cardActions.map((action) => mongoose.Types.ObjectId(action._id));
		if(data.dashActions) job.dash_actions = data.dashActions.map((action) => mongoose.Types.ObjectId(action._id));

		job.save(function(err, saved) {
			if(!err) {
				res.status(200).json(saved._id);
				req.workorder = saved;
				next();
			}
			else {
				res.status(500).send(err);
				console.log(err)
			}
		});
	})
});

route.get('/get/details/job', function(req, res, next) {
	// return job by id
	if(req.query.jwt) {
		var id = req.query.id;
		jobModel.findOne({ '_id': id })
		.populate({
			path: 'card_actions dash_actions endpoints',
			populate: {
				path: 'actions',
			}
		})
		.lean()
		.exec(function(err, job) {
			if(!err) {
				if(job === null) job = {};
				res.json(job);
			}
			else {
				console.log(err);
			}
		});
	}
});

route.post('/post/create/endpoint', jsonParser, function(req, res, next) {
	// save endpoint
	var data = req.body.data;
	var newEndpoint = new endpointModel({
		name: data.name,
		route: data.route,
		note: data.note,
		actions: data.actions.map((action) => mongoose.Types.ObjectId(action._id)) || []
	});

	newEndpoint.save(function(err, saved) {
		if(!err) {
			res.status(200).json(saved._id);
			req.workorder = saved;
			next();
		}
		else {
			res.status(500).send(err);
			console.log(err)
		}
	});
});

route.put('/put/update/endpoint', jsonParser, function(req, res, next) {
	// save endpoint
	var data = req.body.data;
	var formId = req.body.formId;
	endpointModel.findOne({_id: formId}, function(err, endpoint) {
		endpoint.name = data.name;
		endpoint.route = data.route;
		endpoint.note = data.note;
		if(data.actions) endpoint.actions = data.actions.map((action) => mongoose.Types.ObjectId(action._id));

		endpoint.save(function(err, saved) {
			if(!err) {
				res.status(200).json(saved._id);
				req.workorder = saved;
				next();
			}
			else {
				res.status(500).send(err);
				console.log(err)
			}
		});
	})
});

route.get('/get/details/endpoint', function(req, res, next) {
	// return endpoint by id
	if(req.query.jwt) {
		var id = req.query.id;
		endpointModel.findOne({ '_id': id })
		.populate({
			path: 'actions',
			model: actionModel
		})
		.lean()
		.exec(function(err, endpoint) {
			if(!err) {
				if(endpoint === null) endpoint = {};
				res.json(endpoint);
			}
			else {
				console.log(err);
			}
		});
	}
});

route.post('/post/create/action', jsonParser, function(req, res, next) {
	// save action
	var data = req.body.data;
	var newAction = new actionModel({
		type: data.type,
		title: data.title,
		route: data.route,
		icon: data.icon,
		note: data.note,
		color: data.color,
		hover_color: data.hoverColor
	});

	newAction.save(function(err, saved) {
		if(!err) {
			res.status(200).json(saved._id);
			req.workorder = saved;
			next();
		}
		else {
			res.status(500).send(err);
			console.log(err)
		}
	});
});

route.put('/put/update/action', jsonParser, function(req, res, next) {
	// save action
	var data = req.body.data;
	var formId = req.body.formId;
	actionModel.findOne({_id: formId}, function(err, action) {
		action.type = data.type;
		action.title = data.title;
		action.route = data.route;
		action.icon = data.icon;
		action.note = data.note;
		action.color = data.color;
		action.hover_color = data.hoverColor;

		action.save(function(err, saved) {
			if(!err) {
				res.status(200).json(saved._id);
				req.workorder = saved;
				next();
			}
			else {
				res.status(500).send(err);
				console.log(err)
			}
		});
	})
});

route.get('/get/details/action', function(req, res, next) {
	// return action by id
	if(req.query.jwt) {
		var id = req.query.id;
		actionModel.findOne({ '_id': id })
		.lean()
		.exec(function(err, action) {
			if(!err) {
				if(action === null) action = {};
				res.json(action);
			}
			else {
				console.log(err);
			}
		});
	}
});

route.get('/get/selectionMenu', function(req, res, next) {
	let query = {};
	// notif role selection

	// Job selection
	if(req.query.type === 'jobs') {
		jobModel.find({})
		.lean()
		.exec(function(err, jobs) {
			if(!err) {
				if(jobs.length === 0) jobs = [{title: 'No Jobs Found'}];
				res.json({jobs: jobs});
			}
			else {
				console.log(err);
			}
		});
	}

	// Endpoint selection
	if(req.query.type === 'endpoints') {
		endpointModel.find({})
		.lean()
		.exec(function(err, endpoints) {
			if(!err) {
				if(endpoints.length === 0) endpoints = [{name: 'No Endpoints Found'}];
				res.json({endpoints: endpoints});
			}
			else {
				console.log(err);
			}
		});
	}

	// action selection
	if(req.query.type === 'actions') {
		if(req.query.filter == 'ignore_modify') {
			query = {type: {$ne: 'modify'}};
		}
		actionModel.find(query)
		.lean()
		.exec(function(err, actions) {
			if(!err) {
				if(actions.length === 0) actions = [{title: 'No Actions Found'}];
				res.json({actions: actions});
			}
			else {
				console.log(err);
			}
		});
	}
});

route.get('/get/onlineUsers', function(req, res, next) {
	var empty = [{_id: 'x', title: 'No users', description: 'No Users Detected', date: new Date()}];
	var connectedClients = req.app.get('connectedClients');
	var userIds = [];

	for (var user in connectedClients) {
		userIds.push(connectedClients[user].userId);
	}

	userModel.find({ _id: { $in: userIds } })
	.lean()
	.exec(function(err, users) {
		if(!err) {
			if(users.length === 0) {
				users = empty;
			}
			else {
				for (var i = 0; i < users.length; i++) {
					users[i].title = users[i].username;
					users[i].description = 'Logged in';
					users[i].date =  new Date();
					for (var x = 0; x < userIds.length; x++) {
						if(users[i]._id === userIds[x]) {
							users[i].date = userIds[x].date;
						}
					}
				}
			}
			res.json(users);
		}
		else {
			console.log(err);
		}
	});
});

route.get('/get/users', function(req, res, next) {
	var empty = [{_id: 'x', title: 'No users', description: 'No Logged in users', date: new Date()}];
	userModel.find({})
	.lean()
	.exec(function(err, users) {
		if(!err) {
			if(users === null) {
				users = empty;
			}
			else {
				for (var i = 0; i < users.length; i++) {
					users[i].title = users[i].username;
					users[i].description = users[i].email + '\n' + users[i].primary_contact;
					users[i].date =  users[i]._id.getTimestamp();
				}
			}
			res.json(users);
		}
		else {
			console.log(err);
		}
	});
});

route.get('/get/jobs', function(req, res, next) {
	// return all jobs
	var empty = [{_id: 'x', title: 'No Jobs', description: 'No Jobs Found', date: new Date()}];
	jobModel.find({})
	.lean()
	.exec(function(err, jobs) {
		if(!err) {
			if(jobs === null) {
				jobs = empty;
			}
			else {
				for (var i = 0; i < jobs.length; i++) {
					jobs[i].name = jobs[i].role;
					jobs[i].description = jobs[i].note;
					jobs[i].date =  jobs[i]._id.getTimestamp();
				}
			}
			res.json(jobs);
		}
		else {
			console.log(err);
		}
	});
});

route.put('/put/kickUser', jsonParser, function(req, res, next) {
	// emit socket.io event
	var id = req.body.id
	var io = req.app.get('socketio');
	var connectedClients = req.app.get('connectedClients');
	var remainingClients = [];

	io.sockets.emit('ejectUser', {user: id});

	for(var client in connectedClients) {
		if(connectedClients[client].userId !== id) {
			remainingClients[connectedClients[client].userId] = connectedClients[client];
		} 
	}

	req.app.set('connectedClients', remainingClients);
	res.status(200).end();
});

route.post('/post/banUser', function(req, res, next) {
	// set banned property on user
	var formId = req.body.formId;
	userModel.findOne({_id: formId}, function(err, user) {
		user.banned = true;

		user.save(function(err, saved) {
			if(!err) {
				res.status(200).json(saved._id);
				req.workorder = saved;
				next();
			}
			else {
				res.status(500).send(err);
				console.log(err)
			}
		});
	})
});

route.post('/post/forceClientRefresh', function(req, res, next) {
	// emit socket.io event
	var io = req.app.get('socketio');
	io.sockets.emit('ejectUser', {user: 'all'});
	req.app.set('connectedClients', []);
});

route.post('/post/backUpData', function(req, res, next) {
	// trigger mongodump
});

module.exports = route;