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
	assigned: { type: Schema.Types.ObjectId, ref: 'user' },
	proof: { type: Schema.Types.ObjectId, ref: 'user' },
	completed: { type: Schema.Types.ObjectId, ref: 'user' },
	application: String,
	searchId: String,
	title: String,
	date: Date,
	startTime: Date,
	endTime: Date,
	phone: String,
	location: String,
	description: String,
	department: String,
	//file: String,
	width: String,
	height: String,
	amount: String,
	measurements: String,
	orientation: String,
	completionDate: Date,
	televisionRequest: String,
	denied: Boolean,
	comments: [commentSchema]
});

module.exports = db.model('graphics', graphicsSchema);