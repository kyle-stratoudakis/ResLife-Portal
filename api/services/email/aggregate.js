var juice = require('juice');
var userModel = require('../../model/user');
var notifModel= require('../../model/notification');
var programModel= require('../../model/program');
var mailer = require('./mailer');
var notifDigest = require('./emailTemplates/notifDigest');
var getDateTime = require('../../../utils/getDateTime');

const aggregate = function(currentHour) {
	var query = {
		notifRoles: { $exists: true, $ne: [] },
		notifTimes: { $exists: true, $ne: [] }
	}
	var notifTimes;

	userModel.find(query, function(err, users) {
		console.log('\nNotif Aggregate ' + getDateTime(new Date(), new Date()));
		for(var i in users) {
			notifTimes = users[i].notifTimes;
			for(var t = 0; t < notifTimes.length; t++) {
				if(notifTimes[t] === currentHour) {
					buildMail(users[i]);
					break;
				}
			}
		}	
	})
}

function buildMail(user) {
	var query = {
		role: {$in: user.notifRoles}
	}

	var mailOptions = {
		to: user.email,
		subject: getDateTime(new Date(), new Date()) + ', ResLife Portal Notifications',
		event: 'notifDigest'
	}

	notifModel.find(query, {}, { sort: {type: 1} })
	.exec(function(err, notifs) {
		if(notifs && notifs.length > 0) {
			// console.log(notifs)
			mailOptions.text = JSON.stringify(notifs, '	', '\n');

			juice.juiceResources(notifDigest(user, notifs), {}, function(err, inlined) {
				if(err) {
					console.log(err)
				}
				else {
					mailOptions.html = inlined;
					mailer(mailOptions);

					for(var i = 0; i < notifs.length; i++) {
						markAsSent(user, notifs[i]._id);
					}

					console.log('mailed ' + notifs.length + ' notifs to ' + user.email);
				}
			});
		}
	});
}

const markAsSent = function(user, notifId) {
	notifModel.findById(notifId, function(err, notif) {
		if(!err && notif) {
			if(notif.temp === true) {
				notif.remove();
			}
			else {
				notif.sent.push(user._id);
				notif.save();
			}
		}
		else if(err) {
			console.log(err);
		}
	})
}

module.exports = aggregate;