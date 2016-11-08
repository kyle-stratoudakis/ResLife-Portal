const formatDate = function(d) {
	return (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear();
}

module.exports = formatDate;