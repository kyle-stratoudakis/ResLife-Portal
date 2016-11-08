var mongoose = require('mongoose');
var userSchema = require('./schema/user');
var commentSchema = require('./schema/comment');
var Schema = mongoose.Schema;
var config = require('../../../config');
mongoose.Promise = global.Promise;

var db = mongoose.createConnection(config.mongodb+'/workorders/graphics');

var user = db.model('user', userSchema);

var graphicsSchema = new mongoose.Schema({
	user: { type: Schema.Types.ObjectId, ref: 'user' },
	assigned: { type: Schema.Types.ObjectId, ref: 'assigned' },
	application: String,
	searchId: String,
	title: String,
	name: String,
	email: String,
	primary_contact: String,
	hall: String,
	type: String,
	date: Date,
	time: Date,
	submittedDate: Date,
	department: String,
	location: String,
	description: String,
	comments: [commentSchema]
});

module.exports = db.model('graphics', graphicsSchema);