function selectedTab(state=0, action) {
	switch(action.type) {
	case 'CHANGE_TAB':
		return action.value;
	case '@@router/LOCATION_CHANGE':
		// console.log(action);
		// return 0
		return state;
	default :
		return state;
	}
}

export default selectedTab;