function snackbar(state={}, action) {
	switch(action.type) {
	case 'SNACKBAR_ALERT':
		let message = action.endpoint;
		let autoHideDuration = 4000;
		let open = true;
		let actionEndpoint = action.endpoint.toLowerCase();

		if(actionEndpoint === 'programs/post/create') {
			message = 'Created Program';
		}
		else if(actionEndpoint === 'programs/put/approve') {
			message = 'Approved Program';
		}
		else if(actionEndpoint === 'programs/put/update') {
			message = 'Edited Program';
		}
		else if(actionEndpoint === 'programs/put/return') {
			message = 'Returned Program';
		}

		return {
			...state,
			message,
			autoHideDuration,
			open
		};
	case 'SNACKBAR_ERROR':
		message = action.error;
		autoHideDuration = 10000;
		open = true;

		return {
			...state,
			message,
			autoHideDuration,
			open
		};
	case 'SNACKBAR_CLOSE':
		return { 
			open: false,
			autoHideDuration
		};
	case 'TOGGLE_NAV':
		return { open: false };
	case '@@router/LOCATION_CHANGE':
		if(state.open === true) {
			return {
				message: '',
				open: false
			};
		}
		else {
			return state;
		}
	default: 
		return {open: state.open}
	}
}

export default snackbar;