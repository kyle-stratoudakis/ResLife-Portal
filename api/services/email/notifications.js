var juice = require('juice');
var mailer = require('./mailer');
var notifModel = require('../../model/notification');
var confirmNew = require('./emailTemplates/confirmNew');
var statusNotif = require('./emailTemplates/statusNotif');
var deleted = require('./emailTemplates/deleted');
var pCardMailer = require('./pCardMailer');

const notification_middleware = function(req, res, next) {
	var template;
	var wo = req.workorder;
	var mailOptions = {
		to: wo.email,
		subject: wo.title,
		text: JSON.stringify(wo),
		workorder: wo._id
	}

	console.log('req.email', req.email, 'req.notif', req.notif);

	// Check email type and set template
	if(req.email) {
		mailOptions.event = req.email;
		if(req.email === 'new_submission') {
			template = confirmNew(wo);
		}
		else if(req.email === 'checked' || req.email === 'rha_checked' || req.email === 'funding_reviewed' || req.email === 'reviewer_approved') {
			template = statusNotif(req.email, wo);
		}
		else if(req.email === 'reviewed') {
			if(wo.checked && wo.reviewed && wo.funding) {
				template = statusNotif('funding', wo);
			}
			else {
				template = statusNotif('reviewed', wo);
			}
		}
		else if(req.email === 'deny' || req.email === 'closed' || req.email === 'comment') {
			wo.comment = req.body.comment;
			wo.who = req.decodedUser.name;
			template = statusNotif(req.email, wo);
		}
		else if(req.email === 'approved' || req.email === 'funding_approved') {
			pCardMailer(wo);
			template = statusNotif('approved', wo);
		}
		else if(req.email === 'deleted') {
			template = deleted(wo);
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
	}

	// Check notification type and register notification
	if(req.notif) {
		if(req.notif === 'new') {
			registerNotif(wo.hall+'_'+req.notif, req.notif, wo);
		}
		else if(req.notif === 'edited') {
			registerTempNotif(wo.hall+'_'+req.notif, req.notif, wo);
		}
		else if(req.notif === 'pcard_new' || req.notif === 'funding_new' || req.notif === 'rha_new' || req.notif === 'tech_new') {
			registerNotif(req.notif, 'new submission', wo);
		}
		else if(req.notif === 'tech_reopened') {
			registerNotif('tech_new', 'reopened', wo);
		}
		else if(req.notif === 'checked') {
			registerNotif(wo.hall+'_reviewer', 'checked', wo);
		}
		else if(req.notif === 'reviewed') {
			if(wo.checked && wo.reviewed && wo.funding) {
				registerNotif('approver', 'funding', wo);
			}
			else {
				deleteNotif(wo._id);
			}
		}
		else if(req.notif === 'rha_checked') {
			registerNotif('funding_new', 'RHA checked', wo);
		}
		else if(req.notif === 'funding_reviewed') {
			registerNotif('approver', 'funding', wo);
		}
		else if(req.notif === 'delete_notif') {
			deleteNotif(wo._id);
		}
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
				searchId: workorder.searchId,
				application: workorder.application
			});
			newNotif.save();
		}
	})
}

function registerTempNotif(role, event, workorder) {
	var newNotif = new notifModel({
		workorder: workorder._id,
		role: role,
		event: event,
		title: workorder.title,
		searchId: workorder.searchId,
		location: workorder.location,
		temp: true
	});
	newNotif.save();
}

function deleteNotif(id) {
	notifModel.remove({ workorder: id }, function(err) {
		if(err) {
			console.log('deleteNotif err: ' + err, 'id: ' + id);
		}
	});
}

module.exports = notification_middleware;