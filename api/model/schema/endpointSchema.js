var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var actionSchema = require('./actionSchema');

var endpointSchema = new mongoose.Schema({
	name: String,
	route: String,
	note: String,
	viewAction: Boolean,
	approveAction: Boolean,
	returnAction: Boolean,
	actions: [{ type: Schema.Types.ObjectId, ref: 'action'}]
});

module.exports = endpointSchema;