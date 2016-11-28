var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../../../config')
var actionSchema = require('./schema/actionSchema');
var endpointSchema = require('./schema/endpointSchema');

// TODO Update connection
var db = mongoose.createConnection(config.mongodb+'/jobs');

var action = db.model('action', actionSchema);
var endpoint = db.model('endpoint', endpointSchema);

var jobSchema = new mongoose.Schema({
	// TODO Update model
	title: String,
	role: String,
	color: String,
	title_color: String,
	subtitle: String,
	link: String,
	note: String,
	order: Number,
	card_actions: [{ type: Schema.Types.ObjectId, ref: 'action'}],
	dash_actions: [{ type: Schema.Types.ObjectId, ref: 'action'}],
	endpoints: [{ type: Schema.Types.ObjectId, ref: 'endpoint'}]
});

module.exports = db.model('job', jobSchema);