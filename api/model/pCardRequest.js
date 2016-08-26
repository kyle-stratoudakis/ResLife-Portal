var mongoose = require('mongoose');
var userSchema = require('./schema/user');
var Schema = mongoose.Schema;
var config = require('../../../config');
mongoose.Promise = global.Promise;

var db = mongoose.createConnection(config.mongodb+'/workorders/pCardRequests');

var user = db.model('user', userSchema);

var pCardSchema = new mongoose.Schema({
	user: { type: Schema.Types.ObjectId, ref: 'user' },
	checked: [{ type: Schema.Types.ObjectId, ref: 'user' }],
	reviewed: { type: Schema.Types.ObjectId, ref: 'user' },
	approved: { type: Schema.Types.ObjectId, ref: 'user' },
	searchId: String,
	title: String,
	name: String,
	email: String,
	primary_contact: String,
	hall: String,
	submittedDate: Date,
	checkedDates: [Date],
	reviewedDate: Date,
	approvedDate: Date,
	items: String,
	description: String,
	cardType: String,
	funding: String,
	needsCheck: Boolean
});

module.exports = db.model('pCardRequest', pCardSchema);