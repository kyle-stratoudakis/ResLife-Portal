var juice = require('juice');
var mailer = require('./mailer');
var pCardModel = require('../../model/pCardRequest');
var notifModel = require('../../model/notification');
var userModel = require('../../model/user');
var confirmNew = require('./emailTemplates/confirmNew');
var fundingApproval = require('./emailTemplates/fundingApproval');
var pcardAuthForm = require('./emailTemplates/pcardAuthForm');

const notification_middleware = function(req, res, next) {
	// console.log('pcardNotifs', req.email, req.notif);
	try {
		if(!req.workorder.email) {
			next();
		}
	}
	catch(ex) {
		console.log(req.workorder, ex);		
	}

	var template;
	var wo = req.workorder;
	var mailOptions = {
		to: wo.email,
		subject: wo.title,
		text: JSON.stringify(wo),
	}

	// Check email type and set template
	if(req.email === 'new') {
		template = confirmNew(wo, 'pcard');
	}
	if(req.email === 'reviewed') {
		template = statusNotif('funding', wo);
	}
	if(req.email === 'approved') {
		var email = fundingApproval(wo);
		pCardModel.findOne({ _id: wo._id })
		.exec(function(err, fields) {
			if(!err) {
				try {
					fields.date = new Date();
					fields.time = new Date();
					fields.type = fields.cardtype;
					mailOptions.attachments = [{ filename: 'P-Card Authorization.pdf', path: pcardAuthForm(fields) }];
				}
				catch(ex) {
					console.log('pcard attachment error, wo._id: ' + wo._id);
					console.log(ex);
				}

				juice.juiceResources(email, {}, function(err, inlined) {
					if(err) {
						console.log(err)
					}
					else {
						mailOptions.to = 'thibaultk1@southernct.edu';
						mailOptions.html = inlined;
						mailer(mailOptions);
					}
				});
			}
		})
	}

	// Inline CSS for HTML mail and send email
	if(template) {
		juice.juiceResources(template, {}, function(err, inlined) {
			if(err) {
				console.log(err)
			}
			else {
				mailOptions.html = inlined;
				mailer(mailOptions);
			}
		});	
	}

	// Check notification type and register notification
	if(req.notif === 'new') {
		registerNotif('funding_new', 'new', wo);
	}
	else if(req.notif === 'rha_new') {
		registerNotif('rha_new', 'RHA new', wo);
	}
	else if(req.notif === 'rha_checked') {
		registerNotif('funding_new', 'RHA checked', wo);
	}
	else if(req.notif === 'reviewed') {
		registerNotif('approver', 'funding', wo);
	}
	else if(req.notif === 'delete_notif') {
		deleteNotif({ workorder: wo._id });
	}

	next();
}

function registerNotif(role, event, workorder) {
	// Check if notif exists for given workorder and overwrite, or create new
	notifModel.findOne({workorder: workorder._id}, function(err, notif) {
		if(notif) {
			notif.role = role;
			notif.event = event;
			notif.sent = [];
			notif.save();
		}
		else {
			var newNotif = new notifModel({
				workorder: workorder._id,
				role: role,
				event: event,
				title: workorder.title,
				searchId: workorder.searchId
			});
			newNotif.save();
		}
	});
}

function registerTempNotif(role, event, wo) {
	console.log('tempNotif')
	var newNotif = new notifModel({
		workorder: wo._id,
		role: role,
		event: event,
		type: wo.type,
		temp: true
	});
	newNotif.save();
}

function deleteNotif(query) {
	notifModel.remove(query, function(err) {
		if(err) {
			console.log('deleteNotif err: ' + err);
		}
	});
}
module.exports = notification_middleware;