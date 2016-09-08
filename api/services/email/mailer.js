var nodemailer = require('nodemailer');
var winston = require('winston');
var smtp = require('nodemailer-smtp-transport');
var stub = require('nodemailer-stub-transport');
var config = require('../../../../config');

// configure logger
require('winston-mongodb').MongoDB;
var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.MongoDB) ({
			db: config.mongodb+'/log',
			collection: 'mailer',
			timestamp: true
		})
	]
});

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
	
	transporter.sendMail(mailOptions)
	.then(function(message) {
		message.subject = mailOptions.subject;
		message.event = mailOptions.event;
		message.workorder = mailOptions.workorder;
		message.attachment = (mailOptions.attachments ? true : false);
		logger.info(message);
	})
}

module.exports = sendMail;