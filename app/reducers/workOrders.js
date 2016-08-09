function workOrders(state=[], action) {
	switch(action.type) {
	case 'RECEIVE_WORKORDERS':
		// console.log(action);
		return [
			...action.workOrders
		]
	case 'LOGGING_OUT':
		return []
	default :
		return state;
	}
}

export default workOrders;