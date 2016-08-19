const getDate = require('./getDate');

const getDateTime = function(date, time) {
	var t = new Date(time);
	var hr = t.getHours();
	var mn = t.getMinutes();
	var tod = (hr >= 12 ? ' pm' : ' am');
	if(hr > 12) {
		hr = hr - 12;
		tod = ' pm';
	}
	if(mn < 10) {
		mn = '0'+ mn;
	}
	return getDate(date) +', '+ hr +':'+ mn + tod;
}

module.exports = getDateTime;