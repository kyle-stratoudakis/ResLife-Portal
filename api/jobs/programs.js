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

	if(data.councilDate) program.councilDate = data.councilDate;
	if(data.councilMotioned) program.councilMotioned = data.councilMotioned;
	if(data.councilSeconded) program.councilSeconded = data.councilSeconded;
	if(data.councilFavor) program.councilFavor = data.councilFavor;
	if(data.councilOpposed) program.councilOpposed = data.councilOpposed;
	if(data.councilAbstained) program.councilAbstained = data.councilAbstained;
	if(data.councilApproval) program.councilApproval = data.councilApproval;

	if(data.evalTime) program.evalTime = data.evalTime;
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

	program.save()
	.then(function(saved) {
		res.json(program._id);
		req.workorder = program;
		req.email = 'new';
		next();
	})
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

		req.email = 'edited';
 		req.notif = 'edited';
		
		if(data.department) program.department = data.department;
		if(data.items) program.items = JSON.stringify(data.items);
		if(data.staff) program.staff = JSON.stringify(data.staff);
		if(data.funding) program.funding = data.funding;
		if(data.fundingType) program.fundingType = data.fundingType;
 		
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
			program.evaluated = decodedUser._id
			req.email = 'evaluated';
			req.notif = 'evaluated';
		}
		if(data.evalTime) program.evalTime = data.evalTime;
		if(data.evalAttendance) program.evalAttendance = data.evalAttendance;
		if(data.evalCost) program.evalCost = data.evalCost;
		if(data.evalCardReturn) program.evalCardReturn = data.evalCardReturn;
		if(data.evalOutcomes) program.evalOutcomes = data.evalOutcomes;
		if(data.evalStrengths) program.evalStrengths = data.evalStrengths;
		if(data.evalWeaknesses) program.evalWeaknesses = data.evalWeaknesses;
		if(data.evalSuggestions) program.evalSuggestions = data.evalSuggestions;
		if(data.evalOther) program.evalOther = data.evalOther;

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
					req.email = 'reviewer_approved';
					req.notif = 'delete_notif';
				}
			}
			else if(role === 'approver') {
				program.approved = userId;
				program.approvedDate = new Date();
				req.email = 'approved';
				req.notif = 'delete_notif';
			}
			program.save()
			.then(function(saved) {
				req.workorder = saved;
				res.json({status: 'approve'});
				next();
			});
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
				req.email = 'return_checked';
				req.notif = 'return_checked'
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
			program.save();
			res.json({status: 'return'});
		}
	});
});
route.put('/put/return', m_notif);

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
				res.json(program);
			}
		});
	}
});

module.exports = route;