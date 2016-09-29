const programQueries = function(req, res, next) {
	var decodedUser = req.decodedUser;
	var userId = decodedUser._id;
	var userHall = decodedUser.hall;
	var role = req.decodedUser.role;
	var status = req.query.status;
	var halls = (req.query.hall ? req.query.hall : null);
	var override = (req.query.override ? req.query.override : null);
	var type = (req.query.type ? req.query.type : null);
	var query = {};

	if(halls) {
		query.hall = { $in: halls };
	}

	if(override) {
		role = override;
	}

	if(type) {
		query.type = type;
	}

	if(role === 'submitter') {
		query.user = userId;

		if(status === 'pending') {
			query.approved = null;
		}
		else if(status === 'approved') {
			query.checked = { $ne: null };
			query.reviewed = { $ne: null };
			query.approved = { $ne: null };
			query.evaluated = null;
		}
		else if(status === 'completed') {
			query.checked = { $ne: null };
			query.reviewed = { $ne: null };
			query.approved = { $ne: null };
			query.evaluated = { $ne: null };
		}
	}
	else if(role === 'hall_director') {
		if(!halls) {
			query.hall = userHall;
		}

		if(status === 'pending') {
			// query.denied = false;
			query.checked = null;
		}
		else if(status === 'approved') {
			query.checked = { $ne: null };
			query.approved = null;
		}
		else if(status === 'completed') {
			query.checked = { $ne: null };
			query.reviewed = { $ne: null };
			query.approved = { $ne: null };
			query.evaluated = null ;
		}
		else if(status === 'evaluated') {
			query.checked = { $ne: null };
			query.reviewed = { $ne: null };
			query.approved = { $ne: null };
			query.evaluated = { $ne: null };
		}
	}
	else if(role === 'reviewer') {
		if(status === 'pending') {
			query.checked = { $ne: null };
			query.reviewed = null;
		}
		else if(status === 'approved') {
			query.reviewed = { $ne: null };
			query.approved = null;
		}
	}
	else if(role === 'approver') {
		if(status === 'pending') {
			query.checked = { $ne: null };
			query.reviewed = { $ne: null };
			query.approved = null;
		}
		else if(status === 'approved') {
			query.approved = { $ne: null };
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
			submittedDate: 1,
			checked: 1,
			reviewed: 1,
			approved: 1,
			evaluated: 1
		};

		req.programSort = {
			sort: {
				'_id': 1
			}
		};
		
		next()
	}
}

module.exports = programQueries;