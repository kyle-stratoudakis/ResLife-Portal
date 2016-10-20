const route = require('express').Router();
const mongoose = require('mongoose');
const techRequestModel= require('../model/techRequest');
const userModel= require('../model/user');
const m_notif = require('../services/email/notifications');
const m_role = require('../middleware/role');
const m_techSupportQuery = require('../middleware/techSupportQueries');
const getSearchId = require('../utils/getSearchId');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

route.get('/get/workorders', m_role, m_techSupportQuery, function(req, res) {
	var query = req.techSupportQuery;
	var projection = req.techSupportProjection;
	var sort = req.techSupportSort;
	var empty = [{_id: 'x', title: 'No Tech Requests', description: 'No Tech Requests Found',  date: new Date()}]

	techRequestModel.find(query, projection, sort, function(err, techRequests) {
		if(!err){
			if(techRequests.length === 0) techRequests = empty;
			res.json(techRequests);
		}
		else {
			res.status(500).send(err);
			console.log(err);
		}
	});
});

route.post('/post/create', jsonParser, m_role, function(req, res, next) {
	var decodedUser = req.decodedUser;
	var data = req.body.data;
	var role = decodedUser.role;

	var techRequest = new techRequestModel({
		application: 'TechSupport',
		date: new Date(),
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

	techRequest.save(function(err, saved) {
		if(!err) {
			res.json(techRequest._id);
			req.workorder = saved;
			req.email = 'new_submission';
			req.notif = 'tech_new';
			next();
		}
		else {
			res.status(500).send(err);
			console.log(err);
		}
	});
});
route.post('/post/create', m_notif);

route.put('/put/update', jsonParser, m_role, function(req, res, next){
	var decodedUser = req.decodedUser;
	var data = req.body.data;
	var formId = req.body.formId;

	techRequestModel.findOne({_id: formId}, function(err, request) {
		request.title = data.title;
		request.user = decodedUser._id;
		request.name = decodedUser.name;
		request.primary_contact = decodedUser.primary_contact;
		request.email = decodedUser.email;
		request.hall = decodedUser.hall;
		request.type = data.type;
		request.description = data.description;
		if(request.closed) {
			request.closed = null;
			request.closedDate = null;
			req.notif = 'tech_reopened';
		}
		request.save(function(err, saved){
			if(!err){
				res.json(request._id);
				req.workorder = saved
				next();
			}
			else {
				res.status(500).send(err);
				console.log(err);
			}
		});
	})
});
route.put('/put/update', m_notif);

route.put('/put/close', jsonParser, m_role, function(req, res, next){
	var decodedUser = req.decodedUser;
	var role = decodedUser.role;
	var userId = decodedUser._id;
	var id = req.body.id;
	var comment = req.body.comment;

	techRequestModel.findOne({_id: id}, function(err, request) {
		if(role === 'technician') {
			request.closed = decodedUser._id;
			request.closedDate = new Date();
			request.comments.push({user: userId, name: decodedUser.name, comment: comment, date: new Date()});
			req.email = 'closed';
			req.notif = 'delete_notif';
		}
		request.save(function(err, saved){
			if(!err){
				res.json(request._id);
				req.workorder = saved;
				next();
			}
			else {
				res.status(500).send(err);
				console.log(err);
			}
		});
	})
});
route.put('/put/close', m_notif);

route.put('/put/delete', jsonParser, function(req, res, next) {
	var id = req.body.id;
	techRequestModel.findOne({ _id : id })
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
		techRequestModel.remove({ _id : id }).exec();
	});
});
route.put('/put/delete', m_notif);

route.get('/get/details', function(req, res) {
	if(req.query.jwt) {
		var id = req.query.id;
		techRequestModel.findOne({'_id': id})
		.populate({
			path: 'user closed',
			select: 'name -_id',
			model: userModel
		})
		.exec(function(err, techRequest) {
			if(!err){
				res.json(techRequest);
			}
			else {
				res.status(500).send(err);
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

	techRequestModel.findOne({ _id: id }, function(err, request) {
		if(comment.remove) {
			var _id = mongoose.Types.ObjectId(comment.remove);
			request.comments.id(_id).remove();
		}
		else {
			request.comments.push({user: userId, name: decodedUser.name, comment: comment, date: new Date()});
			if(request.user != userId) req.email = 'comment';
			req.notif = 'comment';
		}

		request.save(function(err, saved) {
			if(!err) {
				res.status(200).json({status: 'comment'});
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

module.exports = route;