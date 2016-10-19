const route = require('express').Router();

const pCardModel= require('../model/pCardRequest');
const userModel= require('../model/user');
const m_notif = require('../services/email/notifications');
const m_role = require('../middleware/role');
const m_pCardQueries = require('../middleware/pCardQueries');
const getSearchId = require('../utils/getSearchId');
const bodyParser = require('body-parser');
const generatePcard = require('../services/email/emailTemplates/pcardAuthForm');
const jsonParser = bodyParser.json();

route.get('/get/workorders', m_role, m_pCardQueries, function(req, res) {
	var query = req.query;
	var projection = req.projection;
	var sort = req.sort;
	var empty = [{'_id': 'x','title': 'No Requests','description': 'No Funding Requests Found', 'date': new Date()}]

	pCardModel.find(query, projection)
	.sort(sort)
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
		application: "Funding",
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
		needsCheck: (data.cardType === 'rha' || data.cardType === 'farnham' ? true : false)
	});

	if(data.items) request.items = JSON.stringify(data.items);
	if(data.staff) request.staff = JSON.stringify(data.staff);
	if(data.funding) request.funding = data.funding;
	if(data.department) request.department = data.department;
	if(data.chartwellsQuote) request.chartwellsQuote = data.chartwellsQuote;

	if(role === 'submitter') {
		if(!request.needsCheck === true) {
			req.notif = 'pcard_new';
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

	pCardModel.findOne({ _id: formId }, function(err, request) {
		request.title = data.title;
		request.type = data.type;
		request.description = data.description;
		request.cardType = data.cardType;
		request.location = data.location;
		request.outcomes = data.outcomes;
		request.travelAuthorization = data.travelAuthorization;

		if((data.cardType === 'rha' || data.cardType === 'farnham') && (!request.checked)) request.needsCheck = true;
		if(data.items) request.items = JSON.stringify(data.items);
		if(data.staff) request.staff = JSON.stringify(data.staff);
		if(data.funding) request.funding = data.funding;
		if(data.department) request.department = data.department;
		if(data.chartwellsQuote) request.chartwellsQuote = data.chartwellsQuote;

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
	var id = req.body.id;
	var role = decodedUser.role;

	pCardModel.findOne({ _id: id }, function(err, request) {
		if(err) {
			console.log(err);
		}
		else {
			if(role === 'checker') {
				request.checked = decodedUser._id;
				request.checkedDate = new Date();
				request.needsCheck = false;
				req.email = 'rha_checked';
				req.notif = 'rha_checked';
			}
			else if(role === 'reviewer') {
				request.reviewed = decodedUser._id;
				request.reviewedDate = new Date();
				req.email = 'funding_reviewed';
				req.notif = 'funding_reviewed';
			}
			else if(role === 'approver') {
				request.approved = decodedUser._id;
				request.approvedDate = new Date();
				req.email = 'funding_approved';
				req.notif = 'delete_notif';
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

route.put('/put/deny', jsonParser, m_role, function(req, res, next){
	var decodedUser = req.decodedUser;
	var id = req.body.id
	var role = decodedUser.role;

	pCardModel.findOne({ _id: id }, function(err, request) {
		if(err) {
			console.log(err);
		}
		else {
			if(role === 'checker') {
				request.denied = true;
				request.checked = null;
				request.checkedDate = null;
				request.reviewed = null;
				request.reviewedDate = null;
				request.approved = null;
				request.approvedDate = null;
				req.email = 'deny';
				req.notif = 'delete_notif';
			}
			else if(role === 'reviewer') {
				request.checked = null;
				request.checkedDate = null;
				request.reviewed = null;
				request.reviewedDate = null;
				request.approved = null;
				request.approvedDate = null;

				if((data.cardType === 'rha')) {
						request.needsCheck = true;
						req.email = 'deny';
						req.notif = 'rha_new';
				}
				else {
				req.email = 'deny';
				req.notif = 'delete_notif';	
				}
			}
			else if(role === 'approver') {
				request.reviewed = null;
				request.reviewedDate = null;
				request.approved = null;
				request.approvedDate = null;

				if((data.cardType === 'rha')) {
						request.needsCheck = true;
						req.email = 'deny';
						req.notif = 'rha_checked';
				}
				else {
				req.email = 'deny';
				req.notif = 'pcard_new';	
				}
			}
			request.save(function(err, saved) {
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

route.put('/put/return', jsonParser, m_role, function(req, res, next) {
	var decodedUser = req.decodedUser;
	var id = req.body.id
	var role = decodedUser.role;

	pCardModel.findOne({ _id: id }, function(err, request) {
		if(err) {
			console.log(err);
		}
		else {
			if(role === 'checker') {
				request.checked = null;
				request.checkedDate = null;
				request.needsCheck = true;
			}
			if(role === 'reviewer') {
				request.reviewed = null;
				request.reviewedDate = null;
			}
			else if(role === 'approver') {
				request.approved = null;
				request.approvedDate = null;
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

route.put('/put/delete', jsonParser, function(req, res, next) {
    var id = req.body.id;
    pCardModel.findOne({ _id : id })
    .exec(function(err, request) {
        if(!err) {
            res.status(200).json({status: 'return'});
            req.email = 'deleted';
            req.notif = 'delete_notif';
            req.workorder = request;
            next();
        }
        else {
            res.status(500).send(err);
            console.log(err);
        }
        pCardModel.remove({ _id : id }).exec();
    });
});
route.put('/put/delete', m_notif);

route.get('/get/details', function(req, res) {
	if(req.query.jwt) {
		var id = req.query.id;
		pCardModel.findOne({ _id: id })
		.populate({
			path: 'user checked reviewed approved',
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

route.put('/put/comment', jsonParser, m_role, function(req, res, next) {
	var decodedUser = req.decodedUser;
	var userId = decodedUser._id;
	var id = req.body.id
	var comment = req.body.comment;

	pCardModel.findOne({ _id: id }, function(err, request) {

		request.comments.push({id: userId, name: decodedUser.name, comment: comment, date: new Date()});

		request.save(function(err, saved) {
			if(!err) {
				res.status(200).json({status: 'comment'});
				req.workorder = saved;
				if(saved.user != userId) req.email = 'comment';
				req.notif = 'comment';
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

route.get('/download', function(req, res) {
	if(req.query.id) {
		pCardModel.findOne({ _id: req.query.id })
		.populate({
			path: 'checked reviewed approved',
			select: 'name -_id',
			model: userModel
		})
		.exec(function(err, fields) {
			if(!err && fields) {
				fields.type = fields.cardType;
				try {
					generatePcard(fields);
				}
				catch (ex) {
					console.log('pCard generate: ' + ex)
				}
				setTimeout(function() {
					try {
						res.download('./api/services/email/sentForms/pcard-'+ fields._id +'.pdf');
					}
					catch (ex) {
						console.log('pcard download pdf ' + ex);
						res.status(500).send(ex);
					}
				}, 1500);
			}
		});
	}
});


module.exports = route;