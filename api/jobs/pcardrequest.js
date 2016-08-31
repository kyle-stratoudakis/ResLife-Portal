const route = require('express').Router();

const pCardModel= require('../model/pCardRequest');
const userModel= require('../model/user');
const m_notif = require('../services/email/pCardNotifs');
const m_role = require('../middleware/role');
const m_pCardQueries = require('../middleware/pCardQueries');
const getSearchId = require('../utils/getSearchId');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// Used to determine number of RHA checkers must
// approve before RHA funding is sent to reviewer
const totalChecked = 2;

route.get('/get/workorders', m_role, m_pCardQueries, function(req, res) {
	var query = req.query;
	var projection = req.projection;
	var sort = req.sort;
	var empty = [{'_id': 'x','title': 'No Requests','description': 'No Funding Requests Found'}]

	pCardModel.find(query, projection, sort)
	.lean()
	.exec(function(err, requests) {
		if(err) {
			console.log(err);
		}
		else {
			if(requests.length === 0) requests = empty;
			res.json(requests);
		}
	});
});

route.post('/post/create', jsonParser, m_role, function(req, res, next) {
	var decodedUser = req.decodedUser;
	var data = req.body.data;
	var role = decodedUser.role;

	var request = new pCardModel({
		searchId: getSearchId(),
		submittedDate: new Date(),
		title: data.title,
		user: decodedUser._id,
		name: decodedUser.name,
		email: decodedUser.email,
		primary_contact: decodedUser.primary_contact,
		hall: decodedUser.hall,
		description: data.description,
		cardType: data.cardType,
		type: data.type,
		date: data.date,
		time: data.time,
		location: data.location,
		outcomes: data.outcomes,
		travelAuthorization: data.travelAuthorization,
		needsCheck: (data.cardType === 'rha' ? true : false)
	});

	if(data.items) request.items = JSON.stringify(data.items);
	if(data.staff) request.staff = JSON.stringify(data.staff);
	if(data.funding) request.funding = data.funding;
	if(data.department) request.department = data.department;
	if(data.chartwellsQuote) request.chartwellsQuote = data.chartwellsQuote;

	if(role === 'submitter') {
		if(!request.needsCheck === true) {
			req.notif = 'new';
		}
		else {
			req.notif = 'rha_new';
		}
	}
	if(role === 'reviewer') {
		request.reviewed = decodedUser._id;
		request.reviewedDate = new Date();
		req.notif = 'reviewed';
	}
	else if(role === 'approver') {
		request.approved = decodedUser._id;
		request.approvedDate = new Date();
	}

	request.save(function(err, saved) {
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

route.put('/put/update', jsonParser, m_role, function(req, res, next){
	var decodedUser = req.decodedUser;
	var data = req.body.data;
	var formId = req.body.formId;

	pCardModel.findOne({ _id: formId }, function(err, request) {
		request.title = data.title;
		request.type = data.type;
		request.description = data.description;
		request.cardType = data.cardType;
		request.location = data.location;
		request.outcomes = data.outcomes;
		request.travelAuthorization = data.travelAuthorization;

		if(data.items) request.items = JSON.stringify(data.items);
		if(data.staff) request.staff = JSON.stringify(data.staff);
		if(data.funding) request.funding = data.funding;
		if(data.department) request.department = data.department;
		if(data.chartwellsQuote) request.chartwellsQuote = data.chartwellsQuote;

		if(request.cardType === 'rha') {
			if(request.checked.length < totalChecked) {
				request.needsCheck = true;
				req.notif = 'checked';
			}
		}
		else {
			request.checked = [];
			request.checkedDates = [];
		}

		request.save(function(err, saved) {
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

	pCardModel.findOne({ _id: id }, function(err, request) {
		if(err) {
			console.log(err);
		}
		else {
			if(role === 'reviewer') {
				request.reviewed = decodedUser._id;
				request.reviewedDate = new Date();
				req.notif = 'reviewed';
			}
			else if(role === 'approver') {
				request.approved = decodedUser._id;
				request.approvedDate = new Date();
				req.email = 'approved';
				req.notif = 'delete_notif';
			}
			else if(role === 'rha') {
				request.checked.push(decodedUser._id);
				request.checkedDates.push(new Date());
				req.notif = 'checked';
				if(request.checked.length >= totalChecked) {
					request.needsCheck = false;
					req.notif = 'checked_complete';
				}
			}

			request.save(function(err, saved) {
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

route.put('/put/return', jsonParser, m_role, function(req, res, next) {
	var decodedUser = req.decodedUser;
	var id = req.body.id
	var role = decodedUser.role;

	pCardModel.findOne({ _id: id }, function(err, request) {
		if(err) {
			console.log(err);
		}
		else {
			if(role === 'reviewer') {
				request.reviewed = null;
				request.reviewedDate = null;
			}
			else if(role === 'approver') {
				request.approved = null;
				request.approvedDate = null;
			}
			else if(role === 'rha') {
				var newChecked = [];
				var newCheckedDates = [];
				for (var i = 0; i < request.checked.length; i++) {
					if(!request.checked[i] === decodedUser._id) {
						newChecked.push(request.checked[i]);
						newCheckedDates(request.checkedDates[i]);
					}
				}
				request.checked = newChecked;
				request.checkedDates = newCheckedDates;
			}
		}

		request.save(function(err, saved) {
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
route.put('/put/return', m_notif);

route.get('/get/details', function(req, res) {
	if(req.query.jwt) {
		var id = req.query.id;
		pCardModel.findOne({ _id: id })
		.populate({
			path: 'user reviewed approved',
			select: 'name -_id',
			model: userModel
		})
		.lean()
		.exec(function(err, request) {
			if(!err) {
				if(request === null) request = {};
				res.json(request);
			}
			else {
				console.log(err);
			}
		});
	}
});

module.exports = route;