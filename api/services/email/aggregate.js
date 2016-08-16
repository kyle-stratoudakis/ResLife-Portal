var juice = require('juice');
var userModel = require('../../model/user');
var notifModel= require('../../model/notification');
var programModel= require('../../model/program');
var mailer = require('./mailer');
var notifDigest = require('./emailTemplates/notifDigest');

const aggregate = function(currentHour) {
	var query = {
		notifRoles: { $exists: true, $ne: [] },
		notifTimes: { $exists: true, $ne: [] }
	}
	var notifTimes;

	userModel.find(query, function(err, users) {
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
		subject: 'ResLife Portal Notifications',
	}

	notifModel.find(query, {}, { sort: {type: 1} })
	.populate({
		path: 'workorder',
		select: 'searchId title',
		model: programModel
	})
	.exec(function(err, notifs) {
		if(notifs && notifs.length > 0) {
			mailOptions.text = JSON.stringify(notifs);

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

					console.log('mailed aggregate of ' + notifs.length + ' notifs');
				}
			});
		}
	});
}

const markAsSent = function(user, notifId) {
	notifModel.findByIdAndUpdate(notifId, { $push: {sent: user._id} })
	.exec(function(err) {
		if(err) {
			console.log(err);
		}
	});
}

module.exports = aggregate;