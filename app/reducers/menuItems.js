function menuItems(state=[], action) {
	switch(action.type) {
	case 'RECEIVE_MENUITEMS':
		return {
			...state,
			...action.menuItems
		}
	case 'LOGGING_OUT':
		return []
	default :
		return state;
	}
}

export default menuItems;