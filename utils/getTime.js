const getTime = function(time) {
	var t = new Date(time);
	var hr = t.getHours();
	var mn = t.getMinutes();
	var tod = (hr >= 12 ? ' pm' : ' am');
	
	if(hr > 12) {
		hr = hr - 12;
		tod = ' pm';
	}
	else if(hr === 0) {
		hr = 12;
	}
	if(mn < 10) {
		mn = '0'+ mn;
	}

	return hr +':'+ mn + tod;
}

module.exports = getTime;