const mongoose = require('mongoose');

const getSearchId = function() {
	var objId = mongoose.Types.ObjectId().toString().substring(19,24);
	var searchId = parseInt(objId, 16).toString();
	if(searchId.length > 6) {
		searchId = searchId.substring(searchId.length-6, searchId.length)
	}
	else if(searchId.length < 6) {
		while (searchId.length < 6) searchId = '0' + searchId;
	}
	return searchId;
}

module.exports = getSearchId;