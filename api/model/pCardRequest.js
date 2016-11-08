var mongoose = require('mongoose');
var userSchema = require('./schema/user');
var config = require('../../../config');
var commentSchema = require('./schema/comment');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var db = mongoose.createConnection(config.mongodb+'/workorders/pCardRequests');

var user = db.model('user', userSchema);

var pCardSchema = new mongoose.Schema({
	user: { type: Schema.Types.ObjectId, ref: 'user' },
	checked: { type: Schema.Types.ObjectId, ref: 'user' },
	reviewed: { type: Schema.Types.ObjectId, ref: 'user' },
	approved: { type: Schema.Types.ObjectId, ref: 'user' },
	application: String,
	searchId: String,
	title: String,
	name: String,
	email: String,
	primary_contact: String,
	hall: String,
	submittedDate: Date,
	checkedDate: Date,
	reviewedDate: Date,
	approvedDate: Date,
	items: String,
	staff: String,
	description: String,
	cardType: String,
	funding: String,
	needsCheck: Boolean,
	type: String,
	date: Date,
	time: Date,
	staff: String,
	location: String,
	department: String,
	outcomes: String,
	travelAuthorization: String,
	chartwellsQuote: String,
	comments: [commentSchema]
});

module.exports = db.model('pCardRequest', pCardSchema);