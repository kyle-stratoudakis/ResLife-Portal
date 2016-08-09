var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var actionSchema = require('./action');

var endpointSchema = new mongoose.Schema({
	name: String,
	route: String,
	note: String,
	actions: [{ type: Schema.Types.ObjectId, ref: 'action'}]
});

module.exports = endpointSchema;