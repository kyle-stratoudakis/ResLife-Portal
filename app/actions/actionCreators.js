import { push } from 'react-router-redux';
import { PROTOCOL, HOST } from '../../../config';

const host = PROTOCOL + HOST;

/*
	Perform router transition in a manner that is synced with the store
	string route - destination route
*/
export function performRoute(route) {
	return function(dispatch) {
		dispatch(push(route));
	}
}

/*
	Perform router transition in a manner that is synced with the store
	and update workorders after routing
	string route - destination route
	string endpoint - arguement passed to fetchWorkorders
*/
export function performRouteAndUpdate(route, endpoint) {
	return function(dispatch) {
		dispatch(push(route));
		dispatch(fetchWorkorders(endpoint));
	}
}

export function routeToTarget(href, target) {
	var link = document.createElement('a');
	link.setAttribute('href', href);
	link.setAttribute('target', target);
	clickLink(link);
	
	return {
		type: 'ROUTE_TARGET',
		href,
		target
	}
}

/*
	Sends request to backend for user data
	object data - contains info collected from login form
	string redirect - path to redirect to on successful login
*/
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

/*
	Displays messages on login screen based on server response
	func dispatch - enables function dispatching
	object json - contains server response message
*/
function handleMessages(dispatch, json) {
	if(json.message) {
		dispatch(setLoginMessage(json.message));
	}
	else {
		return json;
	}
}

/*
	Dispatches functions that clear user state in frontend
	effectivly logging the user out
*/
export function logOut() {
	return function (dispatch) {
		dispatch(loggingOut());
		dispatch(push('/Login'));
		dispatch(refreshPage(true));
	}
}

/*
	Sends request for users assigned jobs
	string jwt - users token for authentication
*/
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

/*
	Sends request for a list of workorders
	string query - string of combined endpoint and GET params
*/
export function fetchWorkorders(query) {
	return function (dispatch) {
		dispatch(getWorkorders())
		console.log(host + '/api/' + query)
		return fetch(host + '/api/' + query)
		.then(handleErrors)
		.then(response => response.json())
		.then(json => dispatch(receiveWorkorders(json)))
		.catch(err => console.log('fetchWorkorders', err))
	}
}

/*
	Sends request for a single workorders details
	string location - job associated with workorder
	string query - GET params
*/
export function fetchDetails(location, query) {
	return function (dispatch) {
		dispatch(getDetails())
		console.log('fetchDetails');
		// console.log(host + '/api/' + location + '/get/details' + query);
		return fetch(host + '/api/' + location + '/get/details' + query)
		.then(handleErrors)
		.then(response => response.json())
		.then(json => dispatch(receiveDetails(json)))
		.catch(err => console.log('fetchDetails', err,))
	}
}

/*
	Sends post request with collected form data
	object requestData - contains endpoint, token and jobId for post request to api
	object formData - contains edited data collected from a form
*/
export function submitForm(requestData, formData) {
	return function (dispatch) {
		var json = JSON.stringify({
				jwt: requestData.jwt,
				jobId: requestData.jobId,
				data: formData
			});
		return fetch(host + '/api/' + requestData.endpoint, {
			method: 'post',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: json
		})
		.then(handleErrors)
		.then(response => response.json())
		.then(json => dispatch(push('/job/' + requestData.location + '/View/' + requestData.location + '/'+json)))
		.catch(err => console.log('submitForm', err))
	}
}

/*
	Sends put request with collected form data to update specific workorder
	object requestData - contains endpoint, token, and ids for put request to api
	object formData - contains edited data collected from a form
	function callback - function to call after successful response
*/
export function updateForm(requestData, formData) {
	return function (dispatch) {
		var json = JSON.stringify({
				jwt: requestData.jwt,
				formId: requestData.formId,
				jobId: requestData.jobId,
				data: formData
			});
		console.log('updateForm')
		console.log(host + '/api/' + requestData.endpoint)
		return fetch(host + '/api/' + requestData.endpoint, {
			method: 'put',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: json
		})
		.then(handleErrors)
		.then(response => response.json())
		.then(json => dispatch(fetchDetails(requestData.location, requestData.type+'?jwt='+requestData.jwt+'&id='+json)))
		.catch(err => console.log('updateForm', err))
	}
}

/*
	Sends request to add comment to specific workorder
	object data - contains comment and authentication data
	string location - job associated with workorder
*/
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


/* 
	Send requests to process action then update frontend from ContentRow
	string endpoint - backend endpoint to send request
	object data - relevent details required by endpoint to complete action
	string update - arguement passed to fecthWorkorders to sync action results with frontend
*/
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

/* 
	Send requests to process action then update frontend from individual form
	string endpoint - backend endpoint to send request
	object data - relevent details fequired by endpoint to complete action
	string route - location to transition to after action is complete
*/
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

export function fetchMenuItems(endpoint) {
	return function (dispatch) {
		return fetch(host + '/api/' + endpoint)
		.then(handleErrors)
		.then(response => response.json())
		.then(json => dispatch(receiveMenuItems(json)))
		.catch(err => console.log('fetchMenuItems', err))
	}
}

export function receiveMenuItems(menuItems) {
	return {
		type: 'RECEIVE_MENUITEMS',
		menuItems
	}
}


/*
	Creates and clicks an HTML link to download a file
	string route - endpoint on backend to link to
	string jwt - users token
	string jobId - id of job associated with request
*/
export function downloadLink(route, jwt, jobId) {
	var link = document.createElement('a');
	link.setAttribute('href', `${host}/api/${route}&jwt=${jwt}&job=${jobId}`);
	link.setAttribute('download', 'Download Link');
	clickLink(link);
	
	return {
		type: 'DOWNLOAD_LINK',
		route
	}
}

/*
	Creates and clicks an HTML link to download a pdf of a single workorder
	string wo - id of workorder
	string location - job associated with workorder
*/
export function downloadPdf(wo, location) {
	var link = document.createElement('a');
	link.setAttribute('href', host + '/api/' + location + '/download?id=' + wo._id);
	link.setAttribute('download', 'P-Card Auth Form-'+wo.searchId);
	clickLink(link);

	return {
		type: 'DOWNLOAD_PDF',
		wo,
		location
	}
}

/*
	Creates and clicks a mailTo link
	object wo - data from workorder
*/
export function emailUser(wo) {
	var link = document.createElement('a');
	link.setAttribute('href', `mailto:${wo.email}?Subject=${wo.title}`);
	clickLink(link);
	
	return {
		type: 'EMAIL_USER',
		wo
	}
}

/*
	Clicks the passed in link based on browser capability
	DOMObject link - DOM link to click
*/
function clickLink(link) {
	if (document.createEvent) { 
		var event = document.createEvent('MouseEvents'); 
		event.initEvent('click', true, true); 
		link.dispatchEvent(event); 
	} 
	else { 
		link.click(); 
	} 
}

/*
	Sends request to delete a specific workorder
	object wo - data from workorder
*/
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

/*
	Generic callback for throwing fetch errors
	object response - object returned by fetch request
*/
function handleErrors(response) {
	if(!response.ok) {
		console.log(response.json())
		throw Error(response.statusText);
	}
	return response;
}

/*
	Remaining functions are dispatched through Redux actions
	to be consumed by Reducers which update the Store
*/
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

export function receiveJobs(jobs) {
	return {
		type: 'RECEIVE_JOBS',
		jobs
	}
}
export function receiveWorkorders(workOrders) {
	return {
		type: 'RECEIVE_WORKORDERS',
		workOrders,
		received: new Date()
	}
}
export function receiveDetails(details) {
	return {
		type: 'RECEIVE_DETAILS',
		details
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
export function refreshPage(forceGet) {
	location.reload(forceGet);
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