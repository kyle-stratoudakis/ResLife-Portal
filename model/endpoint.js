var mongoose = require('mongoose');
var config = require('../../config')

// TODO Update connection
var db = mongoose.createConnection(config.mongodb+'/jobs/endpoints');

var endpointSchema = require('./schema/endpoint');

module.exports = db.model('endpoint', endpointSchema);