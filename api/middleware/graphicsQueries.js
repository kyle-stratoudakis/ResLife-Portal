const graphicsQueries = function(req, res, next) {
	var decodedUser = req.decodedUser;
	var userId = decodedUser._id;
	var userHall = decodedUser.hall;
	var role = req.decodedUser.role;
	var status = req.query.status;
	var halls = (req.query.hall ? req.query.hall : null);
	var override = (req.query.override ? req.query.override : null);
	var type = (req.query.type ? req.query.type : null);
	var query = {};

	/*
		This will also be able to be changed according to the tracking that is implemented.
		Should be fairly easy.
	 */

	if(halls) {
		query.hall = { $in: halls };
	}

	if(override) {
		role = override;
	}

	if(type) {
		query.type = type;
	}

	if(status === 'new') {
		query.checked = { $ne: null };
		query.reviewed = { $ne: null };
		query.approved = { $ne: null };
		query.evaluated = null;
	}
	if(status === 'assigned') {
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
	
	if(query) {
		req.graphicsQuery = query;

		req.graphicsProjection = {
			searchId: 1,
			title: 1,
			name: 1,
			type: 1,
			description: 1,
			submittedDate: 1,
			assigned: 1,
			completed: 1
		};

		req.graphicsSort = {
			sort: {
				'_id': 1
			}
		};
		
		next()
	}
}

module.exports = graphicsQueries;