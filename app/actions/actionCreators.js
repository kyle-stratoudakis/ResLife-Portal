import { push } from 'react-router-redux';
import { PROTOCOL, HOST } from '../../../config';

const host = PROTOCOL + HOST;

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
		return fetch(host + '/login', {
			method: 'post',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: json
		})
		.then(handleErrors)
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
		return fetch(host + '/api/getJobs?jwt=' + jwt)
		.then(handleErrors)
		.then(response => response.json())
		.then(json => dispatch(receiveJobs(json)))
		.catch(err => console.log('fetchJobs', err))
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
		return fetch(host + '/api/' + query)
		.then(handleErrors)
		.then(response => response.json())
		.then(json => dispatch(receiveWorkorders(json)))
		.catch(err => console.log('fetchWorkorders', err))
	}
}

export function receiveWorkorders(workOrders) {
	return {
		type: 'RECEIVE_WORKORDERS',
		workOrders,
		received: new Date()
	}
}

export function fetchDetails(location, query) {
	return function (dispatch) {
		dispatch(getDetails())
		return fetch(host + '/api/' + location + '/get/details' + query)
		.then(handleErrors)
		.then(response => response.json())
		.then(json => dispatch(receiveDetails(json)))
		.catch(err => console.log('fetchDetails', err))
	}
}

export function receiveDetails(details) {
	return {
		type: 'RECEIVE_DETAILS',
		details
	}
}

export function submitForm(jwt, location, jobId, data) {
	return function (dispatch) {
		var json = JSON.stringify({
				jwt,
				jobId,
				data
			});
		return fetch(host + '/api/' + location + '/post/create', {
			method: 'post',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: json
		})
		.then(handleErrors)
		.then(response => response.json())
		.then(json => dispatch(push('/job/' + location + '/View/' + location + '/'+json)))
		.then(dispatch(snackbarAlert(location + '/post/create')))
		.catch(err => console.log('submitForm', err))
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
		return fetch(host + '/api/' + location + '/put/update', {
			method: 'put',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: json
		})
		.then(handleErrors)
		.then(response => response.json())
		.then(json => dispatch(fetchDetails(location, '?jwt='+jwt+'&id='+json)))
		.then(dispatch(snackbarAlert(location + '/put/update')))
		.catch(err => console.log('updateForm', err))
	}
}

export function comment(data, location) {
	return function (dispatch) {
		var json = JSON.stringify(data);
		return fetch(host + '/api/' + location + '/put/comment', {
			method: 'put',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: json
		})
		.then(handleErrors)
		.then(response => response.json())
		.then(json => dispatch(fetchDetails(location, '?jwt='+data.jwt+'&id='+data.id)))
		.catch(err => console.log('comment', err))
	}
}

export function modifyAction(endpoint, data, update) {
	return function (dispatch) {
		var json = JSON.stringify(data);
		return fetch(host + '/api/' + endpoint, {
			method: 'put',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: json
		})
		.then(handleErrors)
		.then(() => dispatch(fetchWorkorders(update)))
		.then(dispatch(snackbarAlert(endpoint)))
		.catch(err => console.log('modifyAction', err))
	}
}

export function workorderAction(endpoint, data, route) {
	return function (dispatch) {
		var json = JSON.stringify(data);
		return fetch(host + '/api/' + endpoint, {
			method: 'put',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: json
		})
		.then(handleErrors)
		.then(() => dispatch(push('/job/'+route)))
		.catch(err => console.log('workorderAction', err))
	}
}

export function downloadLink(route, jwt, jobId) {
	var link = document.createElement('a');
	link.setAttribute('href', `${host}/api/${route}&jwt=${jwt}&job=${jobId}`);
	link.setAttribute('download', 'Download Link');

	if (document.createEvent) {
		var event = document.createEvent('MouseEvents');
		event.initEvent('click', true, true);
		link.dispatchEvent(event);
	}
	else {
		link.click();
	}
	
	return {
		type: 'DOWNLOAD_LINK',
		route
	}
}

export function downloadPdf(wo, location) {
	var link = document.createElement('a');
	link.setAttribute('href', host + '/api/' + location + '/download?id=' + wo._id);
	link.setAttribute('download', 'P-Card Auth Form-'+wo.searchId);

	if (document.createEvent) {
		var event = document.createEvent('MouseEvents');
		event.initEvent('click', true, true);
		link.dispatchEvent(event);
	}
	else {
		link.click();
	}
	
	return {
		type: 'DOWNLOAD_PDF',
		wo,
		location
	}
}

export function emailUser(wo) {
	var link = document.createElement('a');
	link.setAttribute('href', `mailto:${wo.email}?Subject=${wo.title}`);

	if (document.createEvent) {
		var event = document.createEvent('MouseEvents');
		event.initEvent('click', true, true);
		link.dispatchEvent(event);
	}
	else {
		link.click();
	}
	
	return {
		type: 'EMAIL_USER',
		wo
	}
}

export function deleteWorkorder(wo) {
	return function (dispatch) {
		let json = JSON.stringify({id: wo._id})
		return fetch(host + '/api/' + wo.application + '/put/delete', {
			method: 'put',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: json
		})
		.then(handleErrors)
		.then(() => dispatch(push('/job/' + wo.application)))
		.catch(err => console.log('fetchDetails', err))
	}
}

export function openDialog(title, content, actions) {
	return {
		type: 'OPEN_DIALOG',
		title: title,
		content: content,
		actions: actions,
		modal: false
	}
}

export function closeDialog() {
	return {
		type: 'CLOSE_DIALOG'
	}
}

export function snackbarAlert(endpoint) {
	return {
		type: 'SNACKBAR_ALERT',
		endpoint
	}
}
export function snackbarError(error) {
	return {
		type: 'SNACKBAR_ERROR',
		error
	}
}
export function snackbarClose() {
	return {
		type: 'SNACKBAR_CLOSE'
	}
}
export function changeTab(value) {
	return {
		type: 'CHANGE_TAB',
		value
	}
}
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

function handleErrors(response) {
	if(!response.ok) {
		throw Error(response.statusText);
	}
	return response;
}