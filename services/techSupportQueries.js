const techSupportQueries = function(req, res, next) {
	var decodedUser = req.decodedUser;
	var userId = decodedUser._id;
	var role = req.decodedUser.role;
	var status = req.query.status;
	var query = null

	if(role === 'submitter') {
		if(status === 'pending') {
			query = {
				'user': userId,
				'closed': null
			};
		}
		else if(status === 'closed') {
			query = {
				'user': userId,
				'closed': { $ne: null }
			};
		}
		else if(status === 'all') {
			query = {
				'user': userId,
			};
		}
	}
	else if(role === 'technician') {
		if(status === 'pending') {
			query = {
				'closed': null
			};
		}
		else if(status === 'closed') {
			query = {
				'closed': { $ne: null }
			};
		}
		else if(status === 'all') {
			query = {};
		}
	}

	if(query) {
		req.techSupportQuery = query;

		req.techSupportProjection = {
			searchId: 1,
			title: 1,
			name: 1,
			type: 1,
			description: 1,
			checked: 1,
			reviewed: 1,
			approved: 1
		};

		req.techSupportSort = {
			sort: {
				'_id': 1
			}
		};
		
		next()
	}
}

module.exports = techSupportQueries;