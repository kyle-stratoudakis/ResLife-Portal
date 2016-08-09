function jobs(state = {}, action) {
	switch(action.type) {
	case 'RECEIVE_JOBS' :
		return [
			...action.jobs
		]
	case 'LOGGING_OUT' :
		return []
	default:
		return state;
	}
	return state;
}

export default jobs;