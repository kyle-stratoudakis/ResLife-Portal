var programModel = require('../../model/program');
var userModel = require('../../model/user');
var pcardAuthForm = require('./emailTemplates/pcardAuthForm');

const pcard = function(id) {
	programModel.findOne({ _id: id })
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
		// console.log(fields)
		if(!err && fields) {
			var filename;
			try {
				filename = pcardAuthForm(fields)
			}
			catch (ex) {
				console.log('stand alone pcard generator error: ' + ex)
			}
		}
	})
	.then(function(filename) {
		return filename
	});
}

module.exports = pcard;