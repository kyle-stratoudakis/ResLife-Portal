var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');

var app = express();
var compiler = webpack(config);

// Access control
var accessConfig = require('../config');
var jwt = require('jwt-simple');
var activeDirectory = require('activedirectory');
var CryptoJS = require('crypto-js');

// Data Modeling
var mongoose = require('mongoose');
var programModel= require('./model/program');
var userModel = require('./model/user');
var jobModel = require('./model/job');
var actionModel = require('./model/action');
var endpointModel = require('./model/endpoint');
var notifModel = require('./model/notification');
var techRequestModel = require('./model/techRequest');

// Middleware
const allowCORS_Middleware = function(req, res, next) {
		// res.header('Access-Control-Allow-Origin', 'example.com');
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
}
const m_notif = require('./services/MailService/notifications');
const m_role = require('./services/role');
const m_programQuery = require('./services/programQueries');
const m_techSupportQuery = require('./services/techSupportQueries');
const aggregate = require('./services/MailService/aggregate');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()

// Express configuration
app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: true,
	publicPath: config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));
app.use(allowCORS_Middleware);

var IP = accessConfig.frontendIP || 'localhost';
var PORT = accessConfig.frontendPORT || '9080';

app.listen(PORT, IP, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at ' + IP + ':' + PORT);
});

function getSearchId() {
	var objId = mongoose.Types.ObjectId().toString().substring(19,24);
	var searchId = parseInt(objId, 16).toString();
	if(searchId.length > 6) {
		searchId = searchId.substring(searchId.length-6, searchId.length)
	}
	else if(searchId.length < 6) {
		while (searchId.length < 6) searchId = '0' + searchId;
	}
	return searchId;
}

// app.post('/login', jsonParser, function(req, res) {
// 	var data = req.body;
// 	var username = data.username;
// 	var password = data.password;
// 	var payload;
// 	var token;

// 	var adConfig = {
// 		baseDN: accessConfig.baseDN,
// 		url: accessConfig.url
// 	}
// 	var ad = new activeDirectory(adConfig)

// 	ad.authenticate(username+"@southernct.edu", password, function(err, auth) {
// 		if (err && err.name === 'InvalidCredentialsError') {
// 			res.json({message: 'Incorrect Username or Password'});
// 		}
// 		else if (auth) {
// 			userModel.findOne({'username': data.username}, function(err, user){
// 				if(err) { console.log('mongoose ' + err) }
// 				else if(user) { // Known user logged in again
// 					token = jwt.encode(user, accessConfig.secret);
// 					payload = {
// 						jwt: token,
// 						user: user
// 					}
// 					res.json(payload);
// 				}
// 				else if(!data.name) { // new user with no details
// 					payload = {message: 'No User Found'}
// 					res.json(payload);
// 				}
// 				else { // new user with details
// 					var newUser = userModel({
// 						username: data.username,
// 						name: data.name,
// 						email: data.username+'@southernct.edu',
// 						primary_contact: data.primary_contact,
// 						hall: data.hall,
// 						jobs: [
// 							mongoose.Types.ObjectId('576157f4b82a57e418c31184'),
// 							mongoose.Types.ObjectId('577d1d51dcfd07716f7b80bf')
// 						]
// 					});

// 					newUser.save(function(err, user) {
// 						if(err) { console.log('newUser ' + err) }
// 						else {
// 							token = jwt.encode(user, accessConfig.secret);
// 							payload = {
// 								jwt: token,
// 								user: user
// 							}
// 							res.json(payload)
// 						}
// 					})
// 				}
// 			});
// 		}
// 	});
// });

app.post('/login', jsonParser, function(req, res) {
	var data = req.body;
	var username = data.username;
	var password = data.password;
	var payload;
	var token;

	var adConfig = {
		baseDN: accessConfig.baseDN,
		url: accessConfig.url
	}
	var ad = new activeDirectory(adConfig)

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
});

app.get('/api/getJobs', function(req, res) {
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

// Refactored get programs route
app.get('/api/get/programs', m_role, m_programQuery, function(req, res) {
	var query = req.programQuery;
	var projection = req.programProjection;
	var sort = req.programSort;
	var empty = [{'_id': 'x','title': 'No Programs','description': 'No Programs Found'}]

	programModel.find(query, projection, sort, function(err, programs) {
		if(err){
			console.log(err);
		}
		else {
			if(programs.length === 0) programs = empty;
			res.json(programs);
		}
	});
});

app.get('/api/programs/get/aggregateNotifs', function(req, res) {
	// console.log('aggregate from post')
	if(req.query) {
		// console.log('hour', req.query.hour);
		var currentHour = parseInt(req.query.hour, 10);
		aggregate(currentHour);
		res.sendStatus(200);
	}
});

app.post('/api/programs/post/create', jsonParser, m_role, function(req, res, next) {
	var decodedUser = req.decodedUser;
	var data = req.body.data;
	var role = decodedUser.role;

	var program = new programModel({
		searchId: getSearchId(),
		submittedDate: new Date(),
		title: data.title,
		user: decodedUser._id,
		name: decodedUser.name,
		email: decodedUser.email,
		primary_contact: decodedUser.primary_contact,
		hall: decodedUser.hall,
		type: data.type,
		date: data.date,
		time: data.time,
		items: JSON.stringify(data.items),
		staff: JSON.stringify(data.staff),
		department: data.department,
		location: data.location,
		department: data.department,
		outcomes: data.outcomes,
		description: data.description,
		funding: data.funding || null,
		fundingType: data.fundingType || '',
		councilDate: data.councilDate || '',
		motionedBy: data.motionedBy || '',
		secondedBy: data.secondedBy || '',
		inFavor: data.inFavor || '',
		opposed: data.opposed || '',
		abstained: data.abstained || '',
		councilApproval: data.councilApproval || '',
		checked: null,
		reviewed: null,
		approved: null,
		evaluated: null
	});

	if(role === 'submitter') {
		req.notif = 'new';
	}
	if(role === 'hall_director') {
		program.checked = decodedUser._id;
		program.checkedDate = new Date();
		req.notif = 'checked';
	}
	if(role === 'reviewer') {
		program.reviewed = decodedUser._id;
		program.reviewedDate = new Date();
	}
	if(role === 'approver') {
		program.checked = decodedUser._id;
		program.checkedDate = new Date();
		program.reviewed = decodedUser._id;
		program.reviewedDate = new Date();
		program.approved = decodedUser._id;
		program.approvedDate = new Date();
	}

	program.save(function(err) {
		if(err) {
			console.log(err);
		}
		else {
			res.json(program._id);
			req.workorder = program;
			req.email = 'new';
			next();
		}
	});
});
app.post('/api/programs/post/create', m_notif);

app.put('/api/programs/put/update', jsonParser, m_role, function(req, res){
	var decodedUser = req.decodedUser;
	var data = req.body.data;
	var formId = req.body.formId;

	programModel.findOne({_id: formId}, function(err, program) {
		program.title = data.title;
		program.date = data.date;
		program.time = data.time;
		program.type = data.type;
		program.location = data.location;
		program.outcomes = data.outcomes;
		program.description = data.description;
		program.department = data.department;
		program.items = JSON.stringify(data.items);
		program.funding = data.funding || null;
		program.fundingType = data.fundingType || '';
		program.staff = JSON.stringify(data.staff);
		if(data.councilDate) program.councilDate = data.councilDate;
		if(data.motionedBy) program.motionedBy = data.motionedBy;
		if(data.secondedBy) program.secondedBy = data.secondedBy;
		if(data.inFavor) program.inFavor = data.inFavor;
		if(data.opposed) program.opposed = data.opposed;
		if(data.abstained) program.abstained = data.abstained;
		if(data.councilApproval) program.councilApproval = data.councilApproval;
		program.save(function() {
			if(err) {
				console.log(err)
			}
			else {
				// console.log('program_updated', program);
				res.json(program._id);
			}
		});
	})
});

app.put('/api/programs/put/approve', jsonParser, m_role, function(req, res, next) {
	var decodedUser = req.decodedUser;
	var userId = decodedUser._id;
	var id = req.body.id
	var role = decodedUser.role;

	programModel.findOne({ _id: id }, function(err, program) {
		if(err) {
			console.log(err);
		}
		else {
			if(role === 'hall_director') {
				program.checked = userId;
				program.checkedDate = new Date();
				req.email = 'checked';
				req.notif = 'checked';
			}
			else if(role === 'reviewer') {
				program.reviewed = userId;
				program.reviewedDate = new Date();
				req.email = 'reviewed';
				req.notif = 'reviewed';
				if(program.funding === null) {
					program.approved = userId;
					program.approvedDate = new Date();
					req.email = 'reviewer_approved';
				}
			}
			else if(role === 'approver') {
				program.approved = userId;
				program.approvedDate = new Date();
				req.email = 'approved';
			}
			program.save();
			req.workorder = program;
			res.json({status: 'approve'});
			next();
		}
	});
})
app.put('/api/programs/put/approve', m_notif);

app.put('/api/programs/put/return', jsonParser, m_role, function(req, res){
	var decodedUser = req.decodedUser;
	var id = req.body.id
	var role = decodedUser.role;

	programModel.findOne({ _id: id }, function(err, program) {
		if(err) {
			console.log(err);
		}
		else {
			if(role === 'hall_director') {
				program.checked = null;
				program.checkedDate = null;
			}
			else if(role === 'reviewer') {
				program.reviewed = null;
				program.reviewedDate = null;
				if(program.funding === null) {
					program.approved = null;
					program.approvedDate = null;
				}
			}
			else if(role === 'approver') {
				program.approved = null;
				program.approvedDate = null;
			}
			program.save();
			res.json({status: 'return'});
		}
	});
})

app.get('/api/programs/get/details', function(req, res) {
	if(req.query.jwt) {
		var id = req.query.id;
		programModel.findOne({'_id': id})
		.populate({
			path: 'user',
			select: 'name',
			model: userModel
		})
		.populate({
			path: 'checked',
			select: 'name',
			model: userModel
		})
		.populate({
			path: 'reviewed',
			select: 'name',
			model: userModel
		})
		.populate({
			path: 'approved',
			select: 'name',
			model: userModel
		})
		.exec(function(err, program) {
			if(err){
				console.log(err);
			}
			else {
				res.json(program);
			}
		});
	}
});

app.post('/api/techsupport/post/create', jsonParser, m_role, function(req, res) {
	var decodedUser = req.decodedUser;
	var data = req.body.data;
	var role = decodedUser.role;

	var techRequest = new techRequestModel({
		title: data.title,
		user: decodedUser._id,
		name: decodedUser.name,
		primary_contact: decodedUser.primary_contact,
		email: decodedUser.email,
		hall: decodedUser.hall,
		type: data.type,
		description: data.description,
		closed: null
	});

	techRequest.save(function(err) {
		if(err) {
			console.log(err);
		}
		else {
			res.json(techRequest._id);
		}
	});
});

app.put('/api/techsupport/put/update', jsonParser, m_role, function(req, res){
	var decodedUser = req.decodedUser;
	var data = req.body.data;
	var formId = req.body.formId;

	techRequestModel.findOne({_id: formId}, function(err, request) {
		request.title = data.title,
		request.user = decodedUser._id,
		request.name = decodedUser.name,
		request.primary_contact = decodedUser.primary_contact,
		request.email = decodedUser.email,
		request.hall = decodedUser.hall,
		request.type = data.type,
		request.description = data.description,
		request.closed = data.closed || null;
		request.save(function(){
			if(err){
				console.log(err)
			}
			else{
				res.json(request._id);
			}
		});
	})
});

app.get('/api/get/techSupport', m_role, m_techSupportQuery, function(req, res) {
	var query = req.techSupportQuery;
	var projection = req.techSupportProjection;
	var sort = req.techSupportSort;
	var empty = [{'_id': 'x','title': 'No Tech Requests','description': 'No Tech Requests Found'}]

	techRequestModel.find(query, projection, sort, function(err, techRequests) {
		if(err){
			console.log(err);
		}
		else {
			if(techRequests.length === 0) techRequests = empty;
			res.json(techRequests);
		}
	});
});

app.get('/api/techsupport/get/details', function(req, res) {
	if(req.query.jwt) {
		var id = req.query.id;
		techRequestModel.findOne({'_id': id})
		.populate({path: 'user', model: userModel})
		.exec(function(err, techRequest) {
			if(err){
				console.log(err);
			}
			else {
				res.json(techRequest);
			}
		});
	}
});

app.get('/api/pdf', function(req, res) {
	if(req.query) {
		if(req.query.form = 'p-card') {
			res.sendFile(path.join(__dirname, './services/MailService/forms/pcard_form.pdf'));
		}
	}
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});