var mongoose = require('mongoose');
var userSchema = require('./schema/user');
var Schema = mongoose.Schema;
var config = require('../../../config');
mongoose.Promise = global.Promise;

var db = mongoose.createConnection(config.mongodb+'/notifications');

var user = db.model('user', userSchema);

var notifSchema = new mongoose.Schema({
	workorder: { type: Schema.Types.ObjectId, ref: 'user' },
	sent: [{ type: Schema.Types.ObjectId, ref: 'user' }],
	role: String,
	event: String,
	type: String,
	message: String,
	temp: Boolean
});

module.exports = db.model('notification', notifSchema);