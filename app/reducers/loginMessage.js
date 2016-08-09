function loginMessage(state='', action) {
	switch(action.type) {
	case 'LOGIN_MESSAGE':
		return action.message;
	case '@@router/LOCATION_CHANGE':
		let split = action.payload.pathname.split('/');
		if(!(split[1] && split[1].toUpperCase() === 'LOGIN')) {
			return {}
		}
	default :
		return state;
	}
}

export default loginMessage;