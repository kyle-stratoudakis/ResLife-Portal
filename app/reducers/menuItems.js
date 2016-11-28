function menuItems(state=[], action) {
	switch(action.type) {
	case 'RECEIVE_MENUITEMS':
		// console.log(action);
		return [
			...action.menuItems
		]
	case 'LOGGING_OUT':
		return []
	default :
		return state;
	}
}

export default menuItems;