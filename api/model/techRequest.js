var mongoose = require('mongoose');
var userSchema = require('./schema/userSchema');
var config = require('../../../config')
var Schema = mongoose.Schema;
var commentSchema = require('./schema/commentSchema');

var db = mongoose.createConnection(config.mongodb+'/workorders/techrequests');

var user = db.model('user', userSchema);

var techRequestSchema = new mongoose.Schema({
	user: { type: Schema.Types.ObjectId, ref: 'user' },
	closed: { type: Schema.Types.ObjectId, ref: 'user' },
	date: Date,
	closedDate: Date,
	title: String,
	name: String,
	email: String,
	primary_contact: String,
	hall: String,
	type: String,
	description: String,
	application: String,
	comments: [commentSchema]
});

module.exports = db.model('techRequest', techRequestSchema);