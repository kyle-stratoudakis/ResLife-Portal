var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
	username: String,
	name: String,
	email: String,
	primary_contact: String,
	hall: String,
	jobs: [{ type: Schema.Types.ObjectId }],
	notifRoles: [String],
	notifTimes: [Number]
});

module.exports = userSchema;