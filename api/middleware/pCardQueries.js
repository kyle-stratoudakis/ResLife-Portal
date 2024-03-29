const pCardQueries = function(req, res, next) {
	var decodedUser = req.decodedUser;
	var userId = decodedUser._id;
	var role = req.decodedUser.role;
	var status = req.query.status;
	var query = {};
	var sort = {'_id': 1};

	if(req.query.cardType) query.cardType = { $in: req.query.cardType };

	if(req.query.override) role = req.query.override;

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
			query.reviewed = { $ne: null };
			query.approved = { $ne: null };
		}
	}
	else if(role === 'checker') {
		if(status === 'pending') {
			query.needsCheck = true;
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
		req.query = query;
		req.sort = sort;

		req.projection = {
			searchId: 1,
			title: 1,
			name: 1,
			description: 1,
			date: 1,
			checked: 1,
			reviewed: 1,
			approved: 1
		};
		
		next()
	}
}

module.exports = pCardQueries;