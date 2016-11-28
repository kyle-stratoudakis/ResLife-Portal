var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var actionSchema = new mongoose.Schema({
	type: String,
	title: String,
	label: String,
	icon: String,
	route: String,
	note: String,
	color: String,
	hover_color: String
});

module.exports = actionSchema;