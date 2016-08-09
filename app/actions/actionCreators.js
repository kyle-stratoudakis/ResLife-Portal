import { push } from 'react-router-redux';
import CryptoJS from 'crypto-js';
import { backendIP, backendPORT } from '../../../config';

const backend = 'http://'+backendIP+':'+backendPORT;

export function loggingIn() {
	return {
		type: 'LOGGING_IN'
	}
}
export function loggingOut() {
	return {
		type: 'LOGGING_OUT'
	}
}
export function getJobs() {
	return {
		type: 'GET_JOBS'
	}
}
export function getWorkorders() {
	return {
		type: 'GET_WORKORDERS'
	}
}
export function getDetails(id) {
	return {
		type: 'GET_DETAILS'
	}
}
export function toggleNav() {
	return {
		type: 'TOGGLE_NAV'
	}
}

export function performRoute(route) {
	return function(dispatch) {
		dispatch(push(route));
	}
}

export function performRouteAndUpdate(route, endpoint) {
	return function(dispatch) {
		dispatch(push(route));
		dispatch(fetchWorkorders(endpoint));
	}
}

export function login(data, redirect) {
	return function (dispatch) {
		dispatch(loggingIn);
		var json = JSON.stringify({
			...data
		});
		return fetch(backend + "/login", {
			method: 'post',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: json
		})
		.then(response => response.json())
		.then(json => handleMessages(dispatch, json))
		.then(json => dispatch(loggedIn(json)))
		.then(json => dispatch(fetchJobs(json.data.jwt)))
		.then(() => (redirect ? dispatch(push(redirect)) : dispatch(push('/Home')) ))
		.catch(err => console.log(err))
	}
}

function handleMessages(dispatch, json) {
	if(json.message) {
		dispatch(setLoginMessage(json.message));
	}
	else {
		return json;
	}
}

export function setLoginMessage(message) {
	return {
		type: 'LOGIN_MESSAGE',
		message
	}
}

export function loggedIn(json) {
	return {
		type: 'LOGGED_IN',
		data: json
	}
}

export function logOut() {
	return function (dispatch) {
		dispatch(loggingOut());
		dispatch(push('/Login'));
	}
}

export function fetchJobs(jwt) {
	return function (dispatch) {
		dispatch(getJobs())
		// console.log('getJobs', backend + "/api/getJobs?jwt=" + jwt)
		return fetch(backend + "/api/getJobs?jwt=" + jwt)
		.then(response => response.json())
		.then(json => dispatch(receiveJobs(json)))
	}
}

export function receiveJobs(jobs) {
	return {
		type: 'RECEIVE_JOBS',
		jobs
	}
}

export function fetchWorkorders(query) {
	return function (dispatch) {
		dispatch(getWorkorders())
		// console.log(backend + "/api/" + query)
		return fetch(backend + "/api/" + query)
		.then(response => response.json())
		.then(json => dispatch(receiveWorkorders(json)))
		.catch((err, json) => console.log(err, json))
	}
}

export function receiveWorkorders(workOrders) {
	return {
		type: 'RECEIVE_WORKORDERS',
		workOrders,
		received: Date().now
	}
}

export function fetchDetails(location, query) {
	return function (dispatch) {
		dispatch(getDetails())
		return fetch(backend + "/api/" + location + "/get/details" + query)
		.then(response => response.json())
		.then(json => dispatch(receiveDetails(json)))
		.catch(err => console.log(err))
	}
}

export function receiveDetails(details) {
	return {
		type: 'RECEIVE_DETAILS',
		details,
		received: Date().now
	}
}

export function submitForm(jwt, location, jobId, data) {
	// console.log('submitForm', data);
	return function (dispatch) {
		var json = JSON.stringify({
				jwt,
				jobId,
				data
			});
		return fetch(backend + "/api/" + location + "/post/create", {
			method: 'post',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: json
		})
		.then(response => response.json())
		.then(json => dispatch(push('/job/' + location + '/View/' + location + '/'+json)))
	}
}

export function updateForm(jwt, location, formId, jobId, data) {
	return function (dispatch) {
		var json = JSON.stringify({
				jwt,
				formId,
				jobId,
				data
			});
		return fetch(backend + "/api/" + location + "/put/update", {
			method: 'put',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: json
		})
		.then(response => response.json())
		.then(json => dispatch(fetchDetails(location, '?jwt='+jwt+'&id='+json)))
	}
}

export function modifyAction(endpoint, data, update) {
	return function (dispatch) {
		dispatch(snackbarAction(endpoint))
		var json = JSON.stringify(data);
		return fetch(backend + "/api/" + endpoint, {
			method: 'put',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: json
		})
		.then(() => dispatch(fetchWorkorders(update)))
		.catch(err => console.log('modifyAction', err))
	}
}

export function workorderAction(endpoint, data, update) {
	return function (dispatch) {
		var json = JSON.stringify(data);
		return fetch(backend + "/api/" + endpoint, {
			method: 'put',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: json
		})
		.then(() => dispatch(fetchDetails(update, '?jwt='+data.jwt+'&id='+data.id)))
		.catch(err => console.log('modifyAction', err))
	}
}

export function snackbarAction(endpoint) {
	return {
		type: 'SNACKBAR_ACTION',
		endpoint
	}
}

export function changeTab(value) {
	return {
		type: 'CHANGE_TAB',
		value
	}
}