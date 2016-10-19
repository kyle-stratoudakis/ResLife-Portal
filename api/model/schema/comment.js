var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = require('./user');

var commentSchema = new mongoose.Schema({
	user: { type: Schema.Types.ObjectId, ref: 'user' },
	name: String,
	comment: String,
	date: Date
});

module.exports = commentSchema;