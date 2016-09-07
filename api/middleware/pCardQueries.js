const pCardQueries = function(req, res, next) {
	var decodedUser = req.decodedUser;
	var userId = decodedUser._id;
	var role = req.decodedUser.role;
	var status = req.query.status;
	var query = {};

	if(role === 'submitter') {
		query.user = userId;

		if(status === 'pending') {
			query.approved = null;
		}
		else if(status === 'approved') {
			query.reviewed = { $ne: null };
			query.approved = { $ne: null };
		}
	}
	else if(role === 'rha') {
		query.cardType = 'rha';

		if(status === 'pending') {
			query.checked = null;
			query.reviewed = null;
		}
		else if(status === 'approved') {
			query.checked = userId;
		}
	}
	else if(role === 'reviewer') {
		if(status === 'pending') {
			query.needsCheck = false;
			query.reviewed = null;
		}
		else if(status === 'approved') {
			query.reviewed = { $ne: null };
		}
	}
	else if(role === 'approver') {
		if(status === 'pending') {
			query.reviewed = { $ne: null };
			query.approved = null;
		}
		else if(status === 'approved') {
			query.approved = { $ne: null };
		}
	}

	if(query) {
		// console.log(role, status, query)
		req.query = query;

		req.projection = {
			searchId: 1,
			title: 1,
			name: 1,
			description: 1,
			approved: 1
		};

		req.sort = {
			sort: {
				'_id': 1
			}
		};
		
		next()
	}
}

module.exports = pCardQueries;