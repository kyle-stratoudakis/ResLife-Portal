const route = require('express').Router();
const fs = require('fs');
const programModel= require('../model/program');
const userModel= require('../model/user');
const m_notif = require('../services/email/notifications');
const m_role = require('../middleware/role');
const m_programQuery = require('../middleware/programQueries');
const getSearchId = require('../utils/getSearchId');
const bodyParser = require('body-parser');
const generatePcard = require('../services/email/emailTemplates/pcardAuthForm');
const jsonParser = bodyParser.json();

route.get('/get/workorders', m_role, m_programQuery, function(req, res) {
	var query = req.query;
	var projection = req.projection;
	var sort = req.sort;
	var empty = [{_id: 'x', title: 'No Programs', description: 'No Programs Found', date: new Date()}];

	programModel.find(query, projection)
	.sort(sort)
	.lean()
	.exec(function(err, programs) {
		if(err) {
			console.log(err);
		}
		else {
			if(programs.length === 0) programs = empty;
			res.json(programs);
		}
	});
});

route.post('/post/create', jsonParser, m_role, function(req, res, next) {
	var decodedUser = req.decodedUser;
	var data = req.body.data;
	var role = decodedUser.role;

	var program = new programModel({
		application: "Programs",
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
		location: data.location,
		outcomes: data.outcomes,
		description: data.description,
		checked: null,
		reviewed: null,
		approved: null,
		evaluated: null
	});

	if(data.department) program.department = data.department;
	if(data.items) program.items = JSON.stringify(data.items);
	if(data.staff) program.staff = JSON.stringify(data.staff);
	if(data.funding) program.funding = data.funding;
	if(data.fundingType) program.fundingType = data.fundingType;

	if(data.travelAuthorization) program.travelAuthorization = data.travelAuthorization;
	if(data.chartwellsQuote) program.chartwellsQuote = data.chartwellsQuote;

	if(data.councilDate) program.councilDate = data.councilDate;
	if(data.councilMotioned) program.councilMotioned = data.councilMotioned;
	if(data.councilSeconded) program.councilSeconded = data.councilSeconded;
	if(data.councilFavor) program.councilFavor = data.councilFavor;
	if(data.councilOpposed) program.councilOpposed = data.councilOpposed;
	if(data.councilAbstained) program.councilAbstained = data.councilAbstained;
	if(data.councilApproval) program.councilApproval = data.councilApproval;

	if(data.evalTime && data.evalTime != {}) program.evalTime = data.evalTime;
	if(data.evalAttendance) program.evalAttendance = data.evalAttendance;
	if(data.evalCost) program.evalCost = data.evalCost;
	if(data.evalCardReturn) program.evalCardReturn = data.evalCardReturn;
	if(data.evalOutcomes) program.evalOutcomes = data.evalOutcomes;
	if(data.evalStrengths) program.evalStrengths = data.evalStrengths;
	if(data.evalWeaknesses) program.evalWeaknesses = data.evalWeaknesses;
	if(data.evalSuggestions) program.evalSuggestions = data.evalSuggestions;
	if(data.evalOther) program.evalOther = data.evalOther;

	if(role === 'submitter') {
		req.notif = 'new';
	}
	if(role === 'hall_director') {
		program.checked = decodedUser._id;
		program.checkedDate = new Date();
		req.notif = 'checked';
	}
	if(role === 'reviewer') {
		program.checked = decodedUser._id;
		program.checkedDate = new Date();
		program.reviewed = decodedUser._id;
		program.reviewedDate = new Date();
		if(!program.funding) {
			program.approved = decodedUser._id;
			program.approvedDate = new Date();
		}
		else {
			req.notif = 'reviewed';
		}
	}
	if(role === 'approver') {
		program.checked = decodedUser._id;
		program.checkedDate = new Date();
		program.reviewed = decodedUser._id;
		program.reviewedDate = new Date();
		program.approved = decodedUser._id;
		program.approvedDate = new Date();
	}

	if(data.councilDate || data.councilMotioned || data.councilSeconded || data.councilFavor || data.councilOpposed || data.councilAbstained || data.councilApproval) {
		req.email = 'hall_council';
		req.notif = 'hall_council';
	}

	program.save(function(err, saved) {
		if(!err) {
			res.json(saved._id);
			req.workorder = saved;
			req.email = 'new_submission';
			next();
		}
		else {
			res.status(500).send(err);
			console.log(err)
		}
	});
});
route.post('/post/create', m_notif);

route.put('/put/update', jsonParser, m_role, function(req, res, next){
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

		if(program.denied === true) {
			program.denied = false;
			req.notif = 'new';
		}
		else {
			req.email = 'edited';
			req.notif = 'edited';
		}
		
		if(data.department) program.department = data.department;
		if(data.items) program.items = JSON.stringify(data.items);
		if(data.staff) program.staff = JSON.stringify(data.staff);
		if(data.funding) program.funding = data.funding;
		if(data.fundingType) program.fundingType = data.fundingType;

		if(data.travelAuthorization) program.travelAuthorization = data.travelAuthorization;
		if(data.chartwellsQuote) program.chartwellsQuote = data.chartwellsQuote;
		
		if(data.councilDate || data.councilMotioned || data.councilSeconded || data.councilFavor || data.councilOpposed || data.councilAbstained || data.councilApproval) {
			req.email = 'hall_council';
			req.notif = 'hall_council';
		}
		if(data.councilDate) program.councilDate = data.councilDate;
		if(data.councilMotioned) program.councilMotioned = data.councilMotioned;
		if(data.councilSeconded) program.councilSeconded = data.councilSeconded;
		if(data.councilFavor) program.councilFavor = data.councilFavor;
		if(data.councilOpposed) program.councilOpposed = data.councilOpposed;
		if(data.councilAbstained) program.councilAbstained = data.councilAbstained;
		if(data.councilApproval) program.councilApproval = data.councilApproval;
		
		if(data.evalTime || data.evalAttendance || data.evalCost || data.evalCardReturn || data.evalOutcomes || data.evalStrengths || data.evalWeaknesses || data.evalSuggestions || data.evalOther) {
			program.evaluated = decodedUser._id;
			program.evaluatedDate = new Date();
			req.email = 'evaluated';
			req.notif = 'evaluated';
		}
		if(data.evalTime && data.evalTime != {}) program.evalTime = data.evalTime;
		if(data.evalAttendance) program.evalAttendance = data.evalAttendance;
		if(data.evalCost) program.evalCost = data.evalCost;
		if(data.evalCardReturn) program.evalCardReturn = data.evalCardReturn;
		if(data.evalOutcomes) program.evalOutcomes = data.evalOutcomes;
		if(data.evalStrengths) program.evalStrengths = data.evalStrengths;
		if(data.evalWeaknesses) program.evalWeaknesses = data.evalWeaknesses;
		if(data.evalSuggestions) program.evalSuggestions = data.evalSuggestions;
		if(data.evalOther) program.evalOther = data.evalOther;

		program.save(function(err, saved) {
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
				if(!program.funding) {
					program.approved = userId;
					program.approvedDate = new Date();
					req.email = 'approved';
					req.notif = 'delete_notif';
				}
			}
			else if(role === 'approver') {
				program.approved = userId;
				program.approvedDate = new Date();
				req.email = 'approved';
				req.notif = 'delete_notif';
			}

			program.save(function(err, saved) {
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

	programModel.findOne({ _id: id }, function(err, program) {
		if(err) {
			console.log(err);
		}
		else {
			if(role === 'hall_director') {
				program.denied = true;
				program.checked = null;
				program.checkedDate = null;
				program.reviewed = null;
				program.reviewedDate = null;
				program.approved = null;
				program.approvedDate = null;
				req.email = 'deny';
				req.notif = 'delete_notif';
			}
			else if(role === 'reviewer') {
				program.checked = null;
				program.checkedDate = null;
				program.reviewed = null;
				program.reviewedDate = null;
				program.approved = null;
				program.approvedDate = null;
				req.email = 'deny';
				req.notif = 'new';
			}
			else if(role === 'approver') {
				program.reviewed = null;
				program.reviewedDate = null;
				program.approved = null;
				program.approvedDate = null;
				req.email = 'deny';
				req.notif = 'checked';
			}
			program.save(function(err, saved) {
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

	programModel.findOne({ _id: id }, function(err, program) {
		if(err) {
			console.log(err);
		}
		else {
			if(role === 'hall_director') {
				program.checked = null;
				program.checkedDate = null;
				req.email = 'return_checked';
				req.notif = 'return_checked';
			}
			else if(role === 'reviewer') {
				program.reviewed = null;
				program.reviewedDate = null;
				req.email = 'deny_reviewed';
				req.notif = 'deny_reviewed';
				if(!program.funding) {
					program.approved = null;
					program.approvedDate = null;
					req.email = 'deny_reviewer_approved';
					req.notif = 'deny_reviewer_approved';
				}
			}
			else if(role === 'approver') {
				program.approved = null;
				program.approvedDate = null;
				req.email = 'deny_approved';
				req.notif = 'deny_approved';
			}
			program.save(function(err, saved) {
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

// Update logic to pattern in techsupport
// route.put('/put/comment', jsonParser, m_role, function(req, res, next) {
// 	var decodedUser = req.decodedUser;
// 	var id = req.body.id
// 	var message = req.body.message;
// 	var role = decodedUser.role;

// 	programModel.findOne({ _id: id }, function(err, program) {
// 		program.comments.push({user: decodedUser._id, message: message, date: new Date()});
// 		req.email = 'comment';
// 		req.notif = 'comment';

// 		program.save(function(err, saved) {
// 			if(!err) {
// 				res.status(200).json({status: 'return'});
// 				req.workorder = saved;
// 				next();
// 			}
// 			else {
// 				res.status(500).send(err);
// 				console.log(err)
// 			}
// 		});
// 	});
// });
// route.put('/put/comment', m_notif);

route.put('/put/delete', jsonParser, function(req, res, next) {
	var id = req.body.id;
	programModel.findOne({ _id : id })
	.exec(function(err, program) {
		if(!err) {
			res.status(200).json({status: 'return'});
			req.email = 'deleted';
			req.notif = 'delete_notif';
			req.workorder = program;
			next();
		}
		else {
			res.status(500).send(err);
			console.log(err);
		}
		programModel.remove({ _id : id }).exec();
	});
});
route.put('/put/delete', m_notif);

route.get('/get/details', function(req, res) {
	if(req.query.jwt) {
		var id = req.query.id;
		programModel.findOne({ '_id': id })
		.populate({
			path: 'user checked reviewed approved evaluated',
			select: 'name -_id',
			model: userModel
		})
		.lean()
		.exec(function(err, program) {
			if(!err) {
				if(program === null) program = {};
				res.json(program);
			}
			else {
				console.log(err);
			}
		});
	}
});

route.get('/download', function(req, res) {
	if(req.query.id) {
		programModel.findOne({ _id: req.query.id })
		.populate({
			path: 'checked reviewed approved',
			select: 'name -_id',
			model: userModel
		})
		.exec(function(err, fields) {
			if(!err && fields) {
				try {
					generatePcard(fields);
				}
				catch (ex) {
					console.log('program generate: ' + ex)
				}
				setTimeout(function() {
					try {
						res.download('./api/services/email/sentForms/pcard-'+ fields._id +'.pdf');
					}
					catch (ex) {
						console.log('program download pdf ' + ex);
						res.status(500).send(ex);
					}
				}, 1500);
			}
		});
	}
});

route.get('/get/tableData', m_role, m_programQuery, function(req, res) {
	var fs = require('fs');
	var getDate = require('../../utils/getDate');
	var getTime = require('../../utils/getTime');
	var getDateTime = require('../../utils/getDateTime');
	var query = req.programQuery;
	programModel.find(query) 
	.select('approved approvedDate checked checkedDate date description email evaluated hall location name outcomes primary_contact reviewed reviewedDate searchId submittedDate time title type user')
	.populate({
		path: 'user checked reviewed approved evaluated',
		select: 'name -_id',
		model: userModel
	})
	.lean()
	.exec(function(err, programs) {
		if(programs && programs.length > 0) {
			var cell;
			var date;
			var keys = Object.keys(programs[0]);
			res.set('Content-Disposition', 'attachment; filename=Programs.csv');
			res.write(keys.join(',') + '\n');
			for(var i = 0; i < programs.length; i++) {
				for(var k = 0; k < keys.length; k++) {
					
					cell = programs[i][keys[k]];
					
					if(cell && keys[k].match(/date|time$/ig)) {
						date = new Date(cell);
						if(keys[k] === 'date') cell = getDate(date);
						else if(keys[k] === 'time') cell = getTime(date);
						else cell = getDateTime(date, date);
					}
					if(cell && cell.name) {
						cell = cell.name;
					}
					if(cell === undefined || cell === null) cell = '';

					res.write(`"${cell.toString().trim().replace(/\"|\-/g, '')}"` + ',');
				}
				res.write('\n');
			}
			res.status(200).end();
		}
		else {
			res.set('Content-Disposition', 'attachment; filename=No_Programs.txt');
			res.status(200).send('No Programs were returned using the query provided likely because you do not have access to any programs.');
		}
	});
});

module.exports = route;