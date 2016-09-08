const getDate = function(date) {
	var d = new Date(date);
	return (d.getMonth()+1) +'/'+ d.getDate() +'/'+ d.getFullYear();
}

module.exports = getDate;