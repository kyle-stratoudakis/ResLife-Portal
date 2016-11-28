import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import Main from './Main';

function mapStateToProps (state) {
	return {
		jobs: state.jobs,
		workOrders: state.workOrders,
		appbar: state.appbar,
		details: state.details,
		token: state.token,
		drawer: state.drawer,
		snackbar: state.snackbar,
		loginMessage: state.loginMessage,
		selectedTab: state.selectedTab,
		dialog: state.dialog,
		menuItems: state.menuItems
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const App = connect(mapStateToProps, mapDispatchToProps)(Main);

export default App;