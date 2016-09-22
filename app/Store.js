import { createStore, compose, applyMiddleware  } from 'redux';
import { syncHistoryWithStore, routerMiddleware } from'react-router-redux';
import { browserHistory } from 'react-router';
import thunkMiddleware from 'redux-thunk';
import persistState from 'redux-localstorage';

// import root reducer
import rootReducer from './reducers/index';

import workOrders from './data/workOrders';
import jobs from './data/jobs';
import appbar from './data/appbar';
import drawer from './data/drawer';
import snackbar from './data/snackbar';
import dialog from './data/dialog';

// create an object for the default data
const defaultState = {
	workOrders,
	jobs,
	appbar,
	drawer,
	snackbar,
	dialog
};

// const enhancer = compose(
// 	applyMiddleware(thunkMiddleware, routerMiddleware(browserHistory)),
// 	window.devToolsExtension(),
// 	persistState(["jobs", "token", "location", "appbar"], null)
// );

const store = createStore(rootReducer, defaultState, compose(applyMiddleware(thunkMiddleware, routerMiddleware(browserHistory)), persistState(["jobs", "token", "location", "appbar"], 'SCSU_PORTAL'), window.devToolsExtension ? window.devToolsExtension() : f => f));

export const history = syncHistoryWithStore(browserHistory, store);

if(module.hot) {
	module.hot.accept('./reducers/'), () => {
		const nextRootReducer = require('./reducers/index').default;
		store.replaceReducer(nextRootReducer);
	}
}

export default store;