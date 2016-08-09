const route = require('express').Router();

const techRequestModel= require('../model/techRequest');
const userModel= require('../model/user');
const m_notif = require('../services/email/notifications');
const m_role = require('../middleware/role');
const m_techSupportQuery = require('../middleware/techSupportQueries');
const getSearchId = require('../utils/getSearchId');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

route.post('/post/create', jsonParser, m_role, function(req, res) {
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

route.put('/put/update', jsonParser, m_role, function(req, res){
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

route.get('/get/workorders', m_role, m_techSupportQuery, function(req, res) {
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

route.get('/get/details', function(req, res) {
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

module.exports = route;