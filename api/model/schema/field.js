var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fieldSchema = new mongoose.Schema({
	type: String,
	labelText: String,
	hintText: String,
	value: String,
	required: Boolean,
	style: Object,
	note: String
});

module.exports = fieldSchema;