const route = require('express').Router();
const fs = require('fs');
const graphicsModel= require('../model/graphic');
const userModel= require('../model/user');
const m_notif = require('../services/email/notifications');
const m_role = require('../middleware/role');
const m_graphicsQuery = require('../middleware/graphicsQueries');
const getSearchId = require('../utils/getSearchId');
const bodyParser = require('body-parser');
const multer = require('multer');
const generatePcard = require('../services/email/emailTemplates/pcardAuthForm');
const jsonParser = bodyParser.json();

route.get('/get/workorders', m_role, m_graphicsQuery, function(req, res) {
	var query = req.graphicsQuery;
	var projection = req.graphicsProjection;
	var sort = req.graphicsSort;
	var empty = [{'_id': 'x','title': 'No graphics','description': 'No graphics Found', 'submittedDate': new Date()}]

	graphicsModel.find(query, projection, sort)
	.lean()
	.exec(function(err, graphics) {
		if(err) {
			console.log(err);
		}
		else {
			if(graphics.length === 0) graphics = empty;
			res.json(graphics);
		}
	});
});

//upload.array(fileName)

route.post('/post/create', jsonParser, m_role, function(req, res, next) {
	var decodedUser = req.decodedUser;
	var data = req.body.data;
	var role = decodedUser.role;

	var graphics = new graphicsModel({
		application: "Graphics",
		searchId: getSearchId(),
		submittedDate: new Date(),
		title: data.title,
		user: decodedUser._id,
		name: decodedUser.name,
		email: decodedUser.email,
		primary_contact: decodedUser.primary_contact,
		hall: decodedUser.hall,	
		date: data.date,
		startTime: data.startTime,
		endTime: data.endTime,
		phone: data.phone,
		department: data.department,
		file: data.file,
		width: data.width,
		height: data.height,
		amount: data.amount,
		measurements: data.measurements,
		orientation: data.orientation,
		completionDate: data.completionDate,
		televisionRequest: data.televisionRequest,
		location: data.location,
		outcomes: data.outcomes,
		description: data.description,
		checked: null,
		reviewed: null,
		completed: null,
		evaluated: null
	});

	if(data.department) graphics.department = data.department;
	if(data.items) graphics.items = JSON.stringify(data.items);
	if(data.staff) graphics.staff = JSON.stringify(data.staff);

	if(role === 'submitter') {
		req.notif = 'new';
	}
	if(role === 'hall_director') {
		graphics.checked = decodedUser._id;
		graphics.checkedDate = new Date();
		req.notif = 'checked';
	}
	if(role === 'reviewer') {
		graphics.checked = decodedUser._id;
		graphics.checkedDate = new Date();
		graphics.reviewed = decodedUser._id;
		graphics.reviewedDate = new Date();
		if(!graphics.funding) {
			graphics.completed = decodedUser._id;
			graphics.completedDate = new Date();
		}
		else {
			req.notif = 'reviewed';
		}
	}
	if(role === 'approver') {
		graphics.checked = decodedUser._id;
		graphics.checkedDate = new Date();
		graphics.reviewed = decodedUser._id;
		graphics.reviewedDate = new Date();
		graphics.completed = decodedUser._id;
		graphics.completedDate = new Date();
	}

	graphics.save(function(err, saved) {
		if(!err) {
			res.json(saved._id);
			req.workorder = saved;
			req.email = 'new';
			next();
		}
		else {
			res.status(500).send(err);
			console.log(err)
		}
	});
});
route.post('/post/create', m_notif);

route.post('/post/upload',jsonParser, m_role, function(req, res, next){
	console.log(req);
});

route.put('/put/update', jsonParser, m_role, function(req, res, next){
	var decodedUser = req.decodedUser;
	var data = req.body.data;
	var formId = req.body.formId;

	console.log(data);

	graphicsModel.findOne({_id: formId}, function(err, graphics) {
		graphics.title = data.title;
		graphics.date = data.date;
		graphics.time = data.time;
		graphics.type = data.type;
		graphics.location = data.location;
		graphics.outcomes = data.outcomes;
		graphics.description = data.description;

		if(graphics.denied === true) {
			graphics.denied = false;
			req.notif = 'new';
		}
		else {
			req.email = 'edited';
			req.notif = 'edited';
		}
		
		if(data.department) graphics.department = data.department;
		if(data.items) graphics.items = JSON.stringify(data.items);
		if(data.staff) graphics.staff = JSON.stringify(data.staff);

		graphics.save(function(err, saved) {
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
route.put('/put/update', m_notif);

route.put('/put/approve', jsonParser, m_role, function(req, res, next) {
	var decodedUser = req.decodedUser;
	var userId = decodedUser._id;
	var id = req.body.id
	var role = decodedUser.role;

	graphicsModel.findOne({ _id: id }, function(err, graphics) {
		if(err) {
			console.log(err);
		}
		else {
			if(role === 'hall_director') {
				graphics.checked = userId;
				graphics.checkedDate = new Date();
				req.email = 'checked';
				req.notif = 'checked';
			}
			else if(role === 'reviewer') {
				graphics.reviewed = userId;
				graphics.reviewedDate = new Date();
				req.email = 'reviewed';
				req.notif = 'reviewed';
				if(!graphics.funding) {
					graphics.completed = userId;
					graphics.completedDate = new Date();
					req.email = 'completed';
					req.notif = 'delete_notif';
					console.log('graphics completed ' + graphics.searchId);
				}
			}
			else if(role === 'approver') {
				graphics.completed = userId;
				graphics.completedDate = new Date();
				req.email = 'completed';
				req.notif = 'delete_notif';
				console.log('graphics completed ' + graphics.searchId);
			}

			graphics.save(function(err, saved) {
				if(!err) {
					res.status(200).json({status: 'approve'});
					req.workorder = saved;
					next();
				}
				else {
					res.status(500).send(err);
					console.log(err)
				}
			});
		}
	});
})
route.put('/put/approve', m_notif);

route.put('/put/deny', jsonParser, m_role, function(req, res, next){
	var decodedUser = req.decodedUser;
	var id = req.body.id
	var role = decodedUser.role;

	graphicsModel.findOne({ _id: id }, function(err, graphics) {
		if(err) {
			console.log(err);
		}
		else {
			if(role === 'hall_director') {
				graphics.denied = true;
				graphics.checked = null;
				graphics.checkedDate = null;
				graphics.reviewed = null;
				graphics.reviewedDate = null;
				graphics.completed = null;
				graphics.completedDate = null;
				req.email = 'deny';
				req.notif = 'delete_notif';
			}
			else if(role === 'reviewer') {
				graphics.checked = null;
				graphics.checkedDate = null;
				graphics.reviewed = null;
				graphics.reviewedDate = null;
				graphics.completed = null;
				graphics.completedDate = null;
				req.email = 'deny';
				req.notif = 'new';
			}
			else if(role === 'approver') {
				graphics.reviewed = null;
				graphics.reviewedDate = null;
				graphics.completed = null;
				graphics.completedDate = null;
				req.email = 'deny';
				req.notif = 'checked';
			}
			graphics.save(function(err, saved) {
				if(!err) {
					res.status(200).json({status: 'deny'});
					req.workorder = saved;
					next();
				}
				else {
					res.status(500).send(err);
					console.log(err)
				}
			});
		}
	});
});
route.put('/put/deny', m_notif);

route.put('/put/return', jsonParser, m_role, function(req, res, next){
	var decodedUser = req.decodedUser;
	var id = req.body.id
	var role = decodedUser.role;

	graphicsModel.findOne({ _id: id }, function(err, graphics) {
		if(err) {
			console.log(err);
		}
		else {
			if(role === 'hall_director') {
				graphics.checked = null;
				graphics.checkedDate = null;
				req.email = 'return_checked';
				req.notif = 'return_checked';
			}
			else if(role === 'reviewer') {
				graphics.reviewed = null;
				graphics.reviewedDate = null;
				req.email = 'deny_reviewed';
				req.notif = 'deny_reviewed';
				if(!graphics.funding) {
					graphics.completed = null;
					graphics.completedDate = null;
					req.email = 'deny_reviewer_completed';
					req.notif = 'deny_reviewer_completed';
				}
			}
			else if(role === 'approver') {
				graphics.completed = null;
				graphics.completedDate = null;
				req.email = 'deny_completed';
				req.notif = 'deny_completed';
			}
			graphics.save(function(err, saved) {
				if(!err) {
					res.status(200).json({status: 'return'});
					req.workorder = saved;
					next();
				}
				else {
					res.status(500).send(err);
					console.log(err)
				}
			});
		}
	});
});
route.put('/put/return', m_notif);

route.put('/put/comment', jsonParser, m_role, function(req, res, next) {
	var decodedUser = req.decodedUser;
	var id = req.body.id
	var message = req.body.message;
	var role = decodedUser.role;

	graphicsModel.findOne({ _id: id }, function(err, graphics) {
		graphics.comments.push({user: decodedUser._id, message: message, date: new Date()});
		req.email = 'comment';
		req.notif = 'comment';

		graphics.save(function(err, saved) {
			if(!err) {
				res.status(200).json({status: 'return'});
				req.workorder = saved;
				next();
			}
			else {
				res.status(500).send(err);
				console.log(err)
			}
		});
	});
});
route.put('/put/comment', m_notif);

route.put('/put/delete', jsonParser, function(req, res, next) {
    var id = req.body.id;
    graphicsModel.findOne({ _id : id })
    .exec(function(err, graphics) {
        if(!err) {
            res.status(200).json({status: 'return'});
            req.email = 'deleted';
            req.notif = 'delete_notif';
            req.workorder = graphics;
            next();
        }
        else {
            res.status(500).send(err);
            console.log(err);
        }
        graphicsModel.remove({ _id : id }).exec();
    });
});
route.put('/put/delete', m_notif);

route.get('/get/details', function(req, res) {
	if(req.query.jwt) {
		var id = req.query.id;
		graphicsModel.findOne({ '_id': id })
		.populate({
			path: 'user checked reviewed completed evaluated',
			select: 'name -_id',
			model: userModel
		})
		.lean()
		.exec(function(err, graphics) {
			if(!err) {
				if(graphics === null) graphics = {};
				res.json(graphics);
			}
			else {
				console.log(err);
			}
		});
	}
});

route.get('/get/tableData', function(req, res) {
	var fs = require('fs');
	var getDate = require('../../utils/getDate');
	var getTime = require('../../utils/getTime');
	var getDateTime = require('../../utils/getDateTime'); // determine final path
	if(req.query.hall) {
		console.log(req.query.hall)
		graphicsModel.find({ hall: { $in: req.query.hall }, completed: { $ne: null } }) 
		.select('completed completedDate checked checkedDate date description email evaluated hall location name outcomes primary_contact reviewed reviewedDate searchId submittedDate time title type user')
		.populate({
			path: 'user checked reviewed completed evaluated',
			select: 'name -_id',
			model: userModel
		})
		.lean()
		.exec(function(err, graphics) {
			if(graphics && graphics.length > 0) {
				var cell;
				var keys = Object.keys(graphics[0]);
				res.set('Content-Disposition', 'attachment; filename=graphics.csv');
				res.write(keys.join(',') + '\n');
				for(var i = 0; i < graphics.length; i++) {
					for(var k = 0; k < keys.length; k++) {
						
						cell = graphics[i][keys[k]];
						
						if(keys[k] === 'date') cell = getDate(new Date(cell));
						if(keys[k] === 'time') cell = getTime(new Date(cell));
						if(keys[k] === 'submittedDate' && cell) cell = getDateTime(new Date(cell), new Date(cell)).replace(/,/g, '');
						if(keys[k] === 'checkedDate' && cell) cell = getDateTime(new Date(cell), new Date(cell)).replace(/,/g, '');
						if(keys[k] === 'reviewedDate' && cell) cell = getDateTime(new Date(cell), new Date(cell)).replace(/,/g, '');
						if(keys[k] === 'completedDate' && cell) cell = getDateTime(new Date(cell), new Date(cell)).replace(/,/g, '');
						if(keys[k] === 'evaluatedDate' && cell) cell = getDateTime(new Date(cell), new Date(cell)).replace(/,/g, '');
						if((keys[k] === 'user' || keys[k] === 'checked' || keys[k] === 'reviewed' || keys[k] === 'completed' || keys[k] === 'evaluated') && cell) {
							cell = cell.name;
						}
						if(keys[k] === 'description' || keys[k] === 'outcomes') {
							cell = cell.replace(/\"/g, `""`);
							cell = cell.replace(/,/g, `\,`);
							cell = cell.replace(/–/g, '\-');
							cell = `"${cell}"`;
						}

						if(cell === undefined || cell === null) cell = '';

						res.write(cell.toString().trim() + ',');
					}
					res.write('\n');
				}
				res.status(200).end();
			}
		});
	}
});

module.exports = route;