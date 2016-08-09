function drawer(state=[], action) {
	switch(action.type) {
	case 'TOGGLE_NAV' :
		let newState = !state.open;
		return { open: newState };
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

export default drawer;