var juice = require('juice');
var mailer = require('./mailer');
var notifModel= require('../../model/notification');
var programModel= require('../../model/program');
var userModel = require('../../model/user');
var confirmNew = require('./emailTemplates/confirmNew');
var statusNotif = require('./emailTemplates/statusNotif');
var pCardForm = require('./emailTemplates/pCardForm');
var pcardAuthForm = require('./emailTemplates/pcardAuthForm');

const notification_middleware = function(req, res, next) {
	if(!req.body){
		next();
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
		template = confirmNew(wo);
	}
	if(req.email === 'checked') {
		template = statusNotif('checked', wo);
	}
	if(req.email === 'reviewed') {
		if(wo.checked && wo.reviewed && wo.funding) {
			template = statusNotif('funding', wo);
		}
		else {
			template = statusNotif('reviewed', wo);
		}
	}
	if(req.email === 'reviewer_approved') {
		template = statusNotif('reviewer approved', wo);
	}
	if(req.email === 'approved') {
		var email = pCardForm(wo);
		programModel.findOne({ _id: wo._id })
		.populate({
			path: 'checked',
			select: 'name -_id',
			model: userModel
		})
		.populate({
			path: 'reviewed',
			select: 'name -_id',
			model: userModel
		})
		.populate({
			path: 'approved',
			select: 'name -_id',
			model: userModel
		})
		.exec(function(err, fields) {
			if(!err) {
				try {
					mailOptions.attachments = [{ filename: 'P-Card Authorization.pdf', path: pcardAuthForm(fields) }];
				}
				catch(ex) {
					console.log('pcard auth attachment error: ' + ex);
				}

				juice.juiceResources(email, {}, function(err, inlined) {
					if(err) {
						console.log(err)
					}
					else {
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
		registerNotif(wo.hall+'_new', 'new', wo);
	}
	else if(req.notif === 'checked') {
		registerNotif('reviewer', 'checked', wo);
	}
	else if(req.notif === 'reviewed') {
		if(wo.checked && wo.reviewed && wo.funding) {
			registerNotif('approver', 'funding', wo);
		}
		else {
			deleteNotif(wo._id);
		}
	}
	else if(req.notif === 'edited') {
		registerNotif(wo.hall+'_new', 'edited', wo);
	}
	else if(req.notif === 'deny_checked') {
		registerNotif(req.decodedUser._id+'_denied', 'hall director denied', wo);
	}
	else if(req.notif === 'deny_reviewed') {
		registerNotif(req.decodedUser._id+'_denied', 'reviewer denied', wo);
	}
	else if(req.notif === 'deny_reviewer_approved') {
		registerNotif(req.decodedUser._id+'_denied', 'reviewer denied', wo);
	}
	else if(req.notif === 'approver_denied') {
		registerNotif(req.decodedUser._id+'_denied', 'approver denied', wo)
	}
	else if(req.notif === 'delete_notif') {
		deleteNotif(wo._id);
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
				type: workorder.type
			});
			newNotif.save();
		}
	})
}

function deleteNotif(id) {
	notifModel.remove({ workorder: id }, function(err) {
		if(err) {
			console.log('deleteNotif err: ' + err);
		}
	});
}
module.exports = notification_middleware;