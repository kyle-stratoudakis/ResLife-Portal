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
import Graphics from './components/forms/Graphics';
import PCardRequest from './components/forms/PCardRequest';
import CardGrid from './components/CardGrid';
import JobContent from './components/JobContent';
import TechRequest from './components/forms/TechRequest';
import User from './components/forms/User';
import Job from './components/forms/Job';
import Action from './components/forms/Action';
import Endpoint from './components/forms/Endpoint';

const Auth = UserAuthWrapper({
	authSelector: state => state.token.user,
	redirectAction: routerActions.replace,
	wrapperDisplayName: 'Auth',
	failureRedirectPath: '/Login'
});

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
					{/* Funding Requests Routes */}
					<Route path="New/Funding" component={Auth(PCardRequest)} />
					<Route path="View/Funding/:_id" component={Auth(PCardRequest)} />
					<Route path="Edit/Funding/:_id" component={Auth(PCardRequest)} />
					{/* TechRequest Routes */}
					<Route path="New/TechRequest" component={Auth(TechRequest)} />
					<Route path="View/TechSupport/:_id" component={Auth(TechRequest)} />
					<Route path="Edit/TechSupport/:_id" component={Auth(TechRequest)} />
					{/* Administrator Routes */}
					<Route path="New/Administrator/User" component={Auth(User)} />
					<Route path="View/Administrator/User/:_id" component={Auth(User)} />
					<Route path="Edit/Administrator/User/:_id" component={Auth(User)} />
					<Route path="New/Administrator/Job" component={Auth(Job)} />
					<Route path="View/Administrator/Job/:_id" component={Auth(Job)} />
					<Route path="Edit/Administrator/Job/:_id" component={Auth(Job)} />
					<Route path="New/Administrator/Action" component={Auth(Action)} />
					<Route path="View/Administrator/Action/:_id" component={Auth(Action)} />
					<Route path="Edit/Administrator/Action/:_id" component={Auth(Action)} />
					<Route path="New/Administrator/Endpoint" component={Auth(Endpoint)} />
					<Route path="View/Administrator/Endpoint/:_id" component={Auth(Endpoint)} />
					<Route path="Edit/Administrator/Endpoint/:_id" component={Auth(Endpoint)} />
					{/* Graphics Routes */}
					<Route path="New/Graphics" component={Auth(Graphics)} />
					<Route path="View/Graphics/:_id" component={Auth(Graphics)} />
					<Route path="Edit/Graphics/:_id" component={Auth(Graphics)} />
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