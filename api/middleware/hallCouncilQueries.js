const hallCouncilQueries = function(req, res, next) {
	var decodedUser = req.decodedUser;
	var userId = decodedUser._id;
	var userHall = decodedUser.hall;
	var role = req.decodedUser.role;
	var status = req.query.status;
	var query = null;

	if(role === 'submitter') {
		if(status === 'pending') {
			query = {
				'user': userId,
				'approved': null
			};
		}
		else if(status === 'approved') {
			query = {
				'user': userId,
				'checked': { $ne: null },
				'reviewed': { $ne: null },
				'approved': { $ne: null }
			};
		}
		else if(status === 'completed') {
			query = {
				'user': userId,
				'checked': { $ne: null },
				'reviewed': { $ne: null },
				'approved': { $ne: null },
				'evaluated': { $ne: null }
			};
		}
		else if(status === 'all') {
			query = {
				'user': userId,
			};
		}
	}
	else if(role === 'hall_director') {
		if(status === 'pending') {
			query = {
				'hall': userHall,
				'checked': null
			};
		}
		else if(status === 'approved') {
			query = {
				'hall': userHall,
				'checked': { $ne: null },
				'approved': null
			};
		}
		else if(status === 'all') {
			query = {
				'hall': userHall,
			};
		}
	}
	else if(role === 'reviewer') {
		if(status === 'pending') {
			query = {
				'checked': { $ne: null },
				'reviewed': null
			};
		}
		else if(status === 'approved') {
			query = {
				'reviewed': { $ne: null },
				'approved': null
			};
		}
		else if(status === 'all') {
			query = {};
		}
	}
	else if(role === 'approver') {
		if(status === 'pending') {
			query = {
				'checked': { $ne: null },
				'reviewed': { $ne: null },
				'approved': null
			};
		}
		else if(status === 'approved') {
			query = {
				'approved': { $ne: null },
			};
		}
		else if(status === 'all') {
			query = {};
		}
	}

	if(query) {
		req.programQuery = query;

		req.programProjection = {
			searchId: 1,
			title: 1,
			name: 1,
			type: 1,
			description: 1,
			checked: 1,
			reviewed: 1,
			approved: 1
		};

		req.programSort = {
			sort: {
				'_id': 1
			}
		};
		
		next()
	}
}

module.exports = hallCouncilQueries;