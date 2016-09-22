function dialog(state = {}, action) {
	switch(action.type) {
	case '@@router/LOCATION_CHANGE':
		return {
			...state,
			open: false
		}
	case 'OPEN_DIALOG':
		return {
			...state,
			open: true,
			title: action.title,
			actions: action.actions,
			content: action.content
		}
	case 'CLOSE_DIALOG':
		return {
			...state,
			open: false
		}
	default:
		return state;
	}
}

export default dialog;