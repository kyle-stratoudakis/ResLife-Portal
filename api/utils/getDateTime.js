const getDate = require('./getDate');
const getTime = require('./getTime');

const getDateTime = function(date, time) {
	var d = getDate(date);
	var t = getTime(time);
	return  d +', '+ t;
}

module.exports = getDateTime;