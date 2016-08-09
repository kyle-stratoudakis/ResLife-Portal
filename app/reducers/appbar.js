function appbar(state = {}, action) {
	switch(action.type) {
	case '@@router/LOCATION_CHANGE':
		let split = action.payload.pathname.split('/');
		let job;

		if(split[1].toUpperCase() === 'HOME' || split[1].toUpperCase() === 'LOGIN') {
			job = split[1][0].toUpperCase()+split[1].slice(1).toLowerCase();
		}
		else {
			job = split[2];
		}

		if(state.title !== job) {
			return {
				...state,
				title: job.replace(/([a-z])([A-Z])/g, '$1 $2'), // Split PascalCase titles with spaces
				color: state[job]
			}
		}
		else {
			return state;
		}
	case 'RECEIVE_JOBS':
		let palette = {};
		for(let i in action.jobs) {
			palette[action.jobs[i].link] = action.jobs[i].color;
		}
		return {
			...state,
			...palette
		}
	default:
		return state;
	}
}

export default appbar;