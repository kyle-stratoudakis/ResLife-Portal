var mongoose = require('mongoose');
var userSchema = require('./schema/user');
var Schema = mongoose.Schema;
var config = require('../../config')

var db = mongoose.createConnection(config.mongodb+'/workorders/techrequests');

var user = db.model('user', userSchema);

var techRequestSchema = new mongoose.Schema({
	user: { type: Schema.Types.ObjectId, ref: 'user' },
	closed: { type: Schema.Types.ObjectId, ref: 'user' },
	title: String,
	name: String,
	email: String,
	primary_contact: String,
	hall: String,
	type: String,
	description: String
});

module.exports = db.model('techRequest', techRequestSchema);