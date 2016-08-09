function token(state = {jwt: JSON.parse(localStorage.getItem('token')) || undefined}, action) {
	switch(action.type) {
	case 'LOGGED_IN' :
		return {
			...action.data
		}
	case 'LOGGING_OUT' :
		return {}
	default:
		return state;
	}

	return state;
}

export default token;