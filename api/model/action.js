var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../../../config')

// TODO Update connection
var db = mongoose.createConnection(config.mongodb+'/jobs/actions');

var actionSchema = require('./schema/actionSchema');

module.exports = db.model('action', actionSchema);