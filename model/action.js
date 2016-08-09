var mongoose = require('mongoose');
var endpoint = require('./endpoint');
var Schema = mongoose.Schema;
var config = require('../../config')

// TODO Update connection
var db = mongoose.createConnection(config.mongodb+'/jobs/actions');

var actionSchema = require('./schema/action');

module.exports = db.model('action', actionSchema);