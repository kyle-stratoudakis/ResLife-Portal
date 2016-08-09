import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import jobs from './jobs';
import workOrders from './workOrders';
import appbar from './appbar';
import details from './details';
import token from './token';
import drawer from './drawer';
import snackbar from './snackbar';
import loginMessage from './loginMessage';
import selectedTab from './selectedTab';

const rootReducer = combineReducers({jobs, workOrders, appbar, details, token, drawer, snackbar, loginMessage, selectedTab, routing: routerReducer});

export default rootReducer;