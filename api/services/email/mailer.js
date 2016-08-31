var nodemailer = require('nodemailer');
var smtp = require('nodemailer-smtp-transport');
var stub = require('nodemailer-stub-transport');
var config = require('../../../../config');

const sendMail = function(mailOptions) {
	var smtpConfig = {
		host: config.mailHost,
		port: config.mailPort,
		auth: {
			user: config.mailUser,
			pass: config.mailPass
		},
		secureConnection: false,
		tls: {
			ciphers:'SSLv3'
		}
	}

	mailOptions.from = config.mailFrom;

	var transporter = nodemailer.createTransport(smtp(smtpConfig));
	// var transporter = nodemailer.createTransport(stub(smtpConfig));
	// console.log('Attempting to send mail')
	transporter.sendMail(mailOptions, function(err, info) {
		if(err) {
			console.log('error-',err);
		}
		else {
			// console.log('info-',info);
		}
	})
}

module.exports = sendMail;