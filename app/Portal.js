import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import { UserAuthWrapper } from 'redux-auth-wrapper'
import { routerActions } from 'react-router-redux'
import injectTapEventPlugin from 'react-tap-event-plugin';
import store, { history } from './Store';

injectTapEventPlugin();

import App from './components/App';
import Login from './components/Login';
import Program from './components/forms/Program';
import CardGrid from './components/CardGrid';
import JobContent from './components/JobContent';
import TechRequest from './components/forms/TechRequest';

const Auth = UserAuthWrapper({
	authSelector: state => state.token.user,
	redirectAction: routerActions.replace,
	wrapperDisplayName: 'Auth',
	failureRedirectPath: '/Login'
})

const router = (
	<Provider store={store}>
		<Router history={history}>
			<Route path="/" component={App}>
				<Route path="/Login" component={Login} />
				<Route path="/Home" component={Auth(CardGrid)} />
				<Route path="job/:_job">
					<IndexRoute component={Auth(JobContent)} />
					{/* Progams Routes */}
					<Route path="New/Program" component={Auth(Program)} />
					<Route path="View/Programs/:_id" component={Auth(Program)} />
					<Route path="Edit/Programs/:_id" component={Auth(Program)} />
					<Route path="Evaluate/Programs/:_id" component={Auth(Program)} />
					{/* TechRequest Routes */}
					<Route path="New/TechRequest" component={Auth(TechRequest)} />
					<Route path="View/TechSupport/:_id" component={Auth(TechRequest)} />
					<Route path="Edit/TechSupport/:_id" component={Auth(TechRequest)} />
					{/* HallCouncil Routes */}
					<Route path="New/HallCouncil" component={Auth(Program)} />
					<Route path="View/HallCouncil/:_id" component={Auth(Program)} />
					<Route path="Edit/HallCouncil/:_id" component={Auth(Program)} />
				</Route>
			</Route>
		</Router>
	</Provider>
)

render(router, document.getElementById('root'));