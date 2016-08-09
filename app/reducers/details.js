function details(state={}, action) {
	switch(action.type) {
	case 'RECEIVE_DETAILS':
		return action.details;
	case '@@router/LOCATION_CHANGE':
		let split = action.payload.pathname.split('/');
		if(!(split[3] && split[3].toUpperCase() === 'VIEW')) {
			return {}
		}
	default :
		return state;
	}
}

export default details;