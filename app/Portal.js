import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

import { UserAuthWrapper } from 'redux-auth-wrapper'
import { routerActions } from 'react-router-redux'

const Auth = UserAuthWrapper({
	authSelector: state => state.token,
	redirectAction: routerActions.replace,
	wrapperDisplayName: 'Auth',
	failureRedirectPath: '/Login'
})

import App from './components/App';
import CardGrid from './components/CardGrid';
import JobContent from './components/JobContent';
import Login from './components/Login';
import Program from './components/forms/Program';
import TechRequest from './components/forms/TechRequest';
import { FormWrapper } from './components/FormWrapper/';

import store, { history } from './Store';

const router = (
	<Provider store={store}>
		<Router history={history}>
			<Route path="/" component={App}>
				<Route path="/Login" component={Login} />
				<Route path="/Home" component={Auth(CardGrid)} />
				<Route path="job/:_job">
					<IndexRoute component={Auth(JobContent)} />
					<Route path="New/Program" component={Auth(Program)} />
					<Route path="View/Programs/:_id" component={Auth(Program)} />
					<Route path="Edit/Programs/:_id" component={Auth(Program)} />
					<Route path="Recap/:_id" component={Program} />
					<Route path="New/TechRequest" component={FormWrapper(TechRequest)} />
					<Route path="View/TechSupport/:_id" component={FormWrapper(TechRequest)} />
					<Route path="Edit/TechSupport/:_id" component={FormWrapper(TechRequest)} />
				</Route>
			</Route>
		</Router>
	</Provider>
)

render(router, document.getElementById('root'));