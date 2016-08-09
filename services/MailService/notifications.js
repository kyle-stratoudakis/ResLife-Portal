var juice = require('juice');
var fs = require('fs'); 
var xfdf = require('xfdf')
var mailer = require('./mailer');
var notifModel= require('../../model/notification');
var programModel= require('../../model/program');
var userModel = require('../../model/user');
var confirmNew = require('./emailTemplates/confirmNew');
var statusNotif = require('./emailTemplates/statusNotif');
var pCardForm = require('./emailTemplates/pCardForm');

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
		if(wo.checked && wo.reviewed && (wo.funding !== null)) {
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
		template = pCardForm(wo);
		// mailOptions.attachments = [{ filename: 'P-Card Form.pdf', path: './services/MailServices/forms/pcard_form.pdf' }];
		programModel.findById(wo._id)
		.select('user title date time name email location funding')
		.populate({
			path: 'user',
			select: 'primary_contact -_id',
			model: userModel
		})
		.exec(function(err, fields) {
			var formFields = { 
				fields: {
					programTitle: fields.title,
					eventDateTime: fields.date.toUTCString(),
					eventLocation: fields.location,
					amountRequested: fields.funding,
					pCardAmount: fields.funding,
					hootlootAmount: fields.funding,
					firstName: fields.name,
					lastName: fields.name,
					email: fields.email,
					phone: fields.user.primary_contact
				}
			}
			var builder = new xfdf({ pdf: 'https://prd-stuaff01.southernct.edu/residencelife/reslife/forms/pcard_form.pdf' });
			builder.fromJSON(formFields);
			fs.writeFile('p-card.xfdf', builder.generate());
			// console.log(builder.generate());
		})
		// mailOptions.attachments = [{ filename: 'P-Card Form.pdf', content:  }];
	}

	// Inline CSS for HTML mail and send email
	juice.juiceResources(template, {}, function(err, inlined) {
		if(err) {
			console.log(err)
		}
		else {
			mailOptions.html = inlined;
			mailer(mailOptions);
		}
	});

	// Check notification type and register notification
	if(req.notif === 'new') {
		registerNotif('hall_director_'+wo.hall, 'new', wo);
	}
	if(req.notif === 'checked') {
		registerNotif('reviewer', 'checked', wo);
	}
	if(req.notif === 'reviewed') {
		if(wo.checked && wo.reviewed && (wo.funding !== null)) {
			registerNotif('approver', 'funding', wo);
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
				type: workorder.type
			});
			newNotif.save();
		}
	})
}

module.exports = notification_middleware;