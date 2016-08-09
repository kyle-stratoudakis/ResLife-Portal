function workOrders(state=[], action) {
	switch(action.type) {
	case 'RECEIVE_WORKORDERS':
		// console.log(action);
		return [
			...action.workOrders
		]
	default :
		return state;
	}
}

export default workOrders;