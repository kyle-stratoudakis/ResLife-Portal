const programQueries = function(req, res, next) {
	var decodedUser = req.decodedUser;
	var userId = decodedUser._id;
	var userHall = decodedUser.hall;
	var role = req.decodedUser.role;
	var status = req.query.status;
	var query = {};
	var sort = {'_id': 1};

	if(req.query.hall) query.hall = { $in: req.query.hall };

	if(req.query.override) role = req.query.override;

	if(req.query.type) query.type = req.query.type;

	if(req.query.sort) {
		var split = req.query.sort.split('_');
		var data = {};
		data[split[0]] = (split[1] === 'asc' ? 1 : -1);
		sort = data;
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
		if(!query.hall) {
			query.hall = userHall;
		}

		if(status === 'pending') {
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
			query.evaluated = null;
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
		req.query = query;
		req.sort = sort;

		req.projection = {
			searchId: 1,
			title: 1,
			name: 1,
			type: 1,
			description: 1,
			date: 1,
			checked: 1,
			reviewed: 1,
			approved: 1,
			evaluated: 1
		}; 
		
		next()
	}
}

module.exports = programQueries;