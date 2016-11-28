var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../../../config')

var db = mongoose.createConnection(config.mongodb+'/users');

var userSchema = require('./schema/userSchema');

module.exports = db.model('user', userSchema);