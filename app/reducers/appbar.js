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
				//title: job.replace(/([a-z])([A-Z])/g, '$1 $2'), // Split PascalCase titles with spaces
				title: state[job].title,
				color: state[job].color
			}
		}
		else {
			return state;
		}
	case 'RECEIVE_JOBS':
		let jobs = {};
		for(let i in action.jobs) {
			jobs[action.jobs[i].link] = {title: action.jobs[i].title, color: action.jobs[i].color};
		}
		return {
			...state,
			...jobs
		}
	default:
		return state;
	}
}

export default appbar;