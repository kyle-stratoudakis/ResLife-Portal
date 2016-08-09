var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var endpointSchema = require('./endpoint');

var actionSchema = new mongoose.Schema({
	type: String,
	title: String,
	label: String,
	icon: String,
	route: String,
	note: String,
	color: String,
	hover_color: String,
	endpoint: [{ type: Schema.Types.ObjectId, ref: 'endpoint' }]
});

module.exports = actionSchema;