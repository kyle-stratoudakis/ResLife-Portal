var mongoose = require('mongoose');
var userSchema = require('./schema/user');
var Schema = mongoose.Schema;
var config = require('../../../config')

var db = mongoose.createConnection(config.mongodb+'/workorders/programs');

var user = db.model('user', userSchema);

var programSchema = new mongoose.Schema({
	user: { type: Schema.Types.ObjectId, ref: 'user' },
	checked: { type: Schema.Types.ObjectId, ref: 'user' },
	reviewed: { type: Schema.Types.ObjectId, ref: 'user' },
	approved: { type: Schema.Types.ObjectId, ref: 'user' },
	evaluated: { type: Schema.Types.ObjectId, ref: 'user' },
	searchId: String,
	title: String,
	name: String,
	email: String,
	primary_contact: String,
	hall: String,
	type: String,
	date: Date,
	time: Date,
	submittedDate: Date,
	checkedDate: Date,
	reviewedDate: Date,
	approvedDate: Date,
	evaluatedDate: Date,
	items: String,
	staff: String,
	department: String,
	location: String,
	department: String,
	outcomes: String,
	description: String,
	equipment: String,
	funding: String,
	fundingType: String,
	councilDate: Date,
	councilMotioned: String,
	councilSeconded: String,
	councilFavor: String,
	councilOpposed: String,
	councilAbstained: String,
	councilApproval: String,
	evalTime: Date,
	evalAttendance: String,
	evalCost: String,
	evalCardReturn: String,
	evalOutcomes: String,
	evalStrengths: String,
	evalWeaknesses: String,
	evalSuggestions: String,
	evalOther: String,
});

module.exports = db.model('program', programSchema);