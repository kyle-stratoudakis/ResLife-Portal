function snackbar(state=[], action) {
	switch(action.type) {
	case 'SNACKBAR_ACTION' :
		let message;
		let autoHideDuration = 3000;

		if(action.endpoint === 'programs/put/approve') {
			message = 'Approved Program';
		}
		else if(action.endpoint === 'programs/put/return') {
			message = 'Returned Program';
		}

		return {
			...state,
			message,
			autoHideDuration, 
		};
	case '@@router/LOCATION_CHANGE' :
		if(state.open === true) {
			return { open: false};
		}
		else {
			return state;
		}
	default :
		return state;
	}
}

export default snackbar;