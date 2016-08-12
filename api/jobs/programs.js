const route = require('express').Router();

const programModel= require('../model/program');
const userModel= require('../model/user');
const m_notif = require('../services/email/notifications');
const m_role = require('../middleware/role');
const m_programQuery = require('../middleware/programQueries');
const getSearchId = require('../utils/getSearchId');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

route.get('/get/workorders', m_role, m_programQuery, function(req, res) {
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

route.post('/post/create', jsonParser, m_role, function(req, res, next) {
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
route.post('/post/create', m_notif);

route.put('/put/update', jsonParser, m_role, function(req, res){
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
			program.save()
			.then(function(saved) {
				req.workorder = saved;
				res.json({status: 'approve'});
				next();
			})
		}
	});
})
route.put('/put/approve', m_notif);

route.put('/put/return', jsonParser, m_role, function(req, res){
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
});

route.put('/put/evaluation', jsonParser, m_role, function(req, res){
	var decodedUser = req.decodedUser;
	var id = req.body.id
	var role = decodedUser.role;

	programModel.findOne({ _id: id }, function(err, program) {
		if(err) {
			console.log(err);
		}
		else {
			program.evaluation = data.evaluation;
			program.attendance = data.attendance;
			program.evaluated = decodedUser._id;
			program.save();
			res.json({status: 'evaluation'});
		}
	});
});

route.get('/get/details', function(req, res) {
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
				if(program === null) program = {};
				console.log(program);
				res.json(program);
			}
		});
	}
});

module.exports = route;