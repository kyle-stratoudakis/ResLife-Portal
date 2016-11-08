var juice = require('juice');
var mailer = require('./mailer');
var programModel = require('../../model/program');
var pCardModel = require('../../model/pCardRequest');
var userModel = require('../../model/user');
var fundingApproval = require('./emailTemplates/fundingApproval');
var pcardAuthForm = require('./emailTemplates/pcardAuthForm');

const pCardMailer = function(wo) {
	var mailOptions = {
		subject: wo.title,
		text: JSON.stringify(wo),
		workorder: wo._id
	}
	if(wo.application === 'Programs') {
		var email = fundingApproval(wo);
		programModel.findOne({ _id: wo._id })
		.populate({
			path: 'checked reviewed approved',
			select: 'name -_id',
			model: userModel
		})
		.exec(function(err, fields) {
			if(!err) {
				mailOptions.to = getHD(wo.hall);
				if(!fields.funding) fields.funding = 'No Funding';

				try {
					mailOptions.attachments = [{ filename: 'ID-'+wo.searchId+' P-Card Authorization.pdf', path: pcardAuthForm(fields) }];
				}
				catch(ex) {
					console.log('pcard auth attachment error, wo._id: ' + wo._id, ex);
				}

				juice.juiceResources(email, {}, function(err, inlined) {
					if(err) {
						console.log(err)
					}
					else {
						mailOptions.html = inlined;
						mailer(mailOptions);
						console.log('mailed pcard for '+ wo.searchId +' to ' + mailOptions.to);
					}
				});
			}
		});
	}
	else if(wo.application === 'Funding') {
		var email = fundingApproval(wo);
		pCardModel.findOne({ _id: wo._id })
		.populate({
			path: 'checked reviewed approved',
			select: 'name -_id',
			model: userModel
		})
		.exec(function(err, fields) {
			if(!err) {
				try {
					fields.date = new Date();
					fields.time = new Date();
					fields.type = fields.cardType;
					if(!fields.checkedDate) fields.checkedDate = '';
					if(!fields.funding) fields.funding = 'No Funding';

					mailOptions.attachments = [{ filename: 'P-Card Authorization.pdf', path: pcardAuthForm(fields) }];
				}
				catch(ex) {
					console.log('pcard attachment error, wo._id: ' + wo._id, ex);
				}

				juice.juiceResources(email, {}, function(err, inlined) {
					if(err) {
						console.log(err)
					}
					else {
						mailOptions.to = getHD('Central_Office');
						mailOptions.html = inlined;
						mailer(mailOptions);
						console.log('mailed pcard for '+ wo.searchId +' to ' + mailOptions.to);
					}
				});
			}
		});
	}
}

function getHD(hall) {
	var email = 'stratoudakk1@southernct.edu'
	// if(hall === 'Schwartz') {
	// 	email = 'gleifertn1@southernct.edu';
	// }
	// else if(hall === 'West') {
	// 	email = 'dishiane1@southernct.edu';
	// }
	// else if(hall === 'Brownell') {
	// 	email = 'rizkj1@southernct.edu';
	// }
	// else if(hall === 'Chase') {
	// 	email = 'eppsjrw1@southernct.edu';
	// }
	// else if(hall === 'Farnham') {
	// 	email = 'vargasc1@southernct.edu';
	// }
	// else if(hall === 'Hickerson') {
	// 	email = 'codyk2@southernct.edu';
	// }
	// else if(hall === 'Neff') {
	// 	email = 'johnsonj103@southernct.edu';
	// }
	// else if(hall === 'North') {
	// 	email = 'boneta1@southernct.edu';
	// }
	// else if(hall === 'Wilkinson') {
	// 	email = 'hoffmannk1@southernct.edu';
	// }
	// 	else if(hall === 'Central_Office') {
	// 	email = 'thibaultk1@southernct.edu';
	// }

	return email;
}

module.exports = pCardMailer;