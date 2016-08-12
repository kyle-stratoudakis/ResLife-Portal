import React from 'react';
import ContentRow from './ContentRow';
import ActionCard from './ActionCard';
import {grey500} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import Card from 'material-ui/Card';
import CardActions from 'material-ui/Card/CardActions';
import CardMedia from 'material-ui/Card/CardMedia';
import CardTitle from 'material-ui/Card/CardTitle';
import FlatButton from 'material-ui/FlatButton';
import Tabs from 'material-ui/Tabs';
import Tab from 'material-ui/Tabs/Tab';
import FontIcon from 'material-ui/FontIcon';

let JobContent = React.createClass({
	componentWillMount () {
		let location = this.props.params['_job'];
		let index = this.props.jobs.findIndex((job) => job.link === location);
		this.handleEndpoint(this.props.jobs[index].endpoints[0].route)
	},

	handleEndpoint (endpoint) {
		let location = this.props.params['_job'];
		let index = this.props.jobs.findIndex((job) => job.link === location);
		let jobId = this.props.jobs[index]._id;
		this.props.fetchWorkorders(location + '/' + endpoint + "&jwt=" + this.props.token.jwt + "&job=" + jobId);
	},

	renderTab (endpoint, i) {
		let location = this.props.params['_job'];
		let index = this.props.jobs.findIndex((job) => job.link === location);
		let jobId = this.props.jobs[index]._id;
		return(
			<Tab
				key={endpoint._id}
				value={i}
				label={endpoint.name}
				// style={{background: grey500}}
				onActive={this.handleEndpoint.bind(null, endpoint.route)}>
				<ContentRow
					parentEndpoint={endpoint.route}
					location={this.props.params['_job']}
					jwt={this.props.token.jwt}
					jobId={jobId}
					modifyAction={this.props.modifyAction}
					performRoute={this.props.performRoute}
					data={this.props.workOrders}
					actions={endpoint.actions}
				/>
			</Tab>
		)
	},

	renderCard (action) {
		return (
			<div key={action._id} className="col-sm-3">
				<ActionCard
					location={this.props.params['_job']}
					performRoute={this.props.performRoute}
					title={action.title}
					route={action.route}
					color={action.color}
					icon={action.icon}
					height={0.5}
				/>
			</div>
		)
	},

	render() {
		let location = this.props.params['_job'];
		let index = this.props.jobs.findIndex((job) => job.link === location);
		let endpoints = this.props.jobs[index].endpoints;
		let dashActions = this.props.jobs[index].dash_actions;
		return (
			<div>
				<br />
				<div className="container">
					{dashActions.map(this.renderCard)}
				</div>
				<br />
				<div className="container">
					<Paper zDepth={2}>
						<Tabs
							// initialSelectedIndex={0}
							value={this.props.selectedTab}
							onChange={(value) => this.props.changeTab(value)}>
							{endpoints.map(this.renderTab)}
						</Tabs>
					</Paper>
					<br /> <br />
				</div>		
			</div>
		)
	}
});

export default JobContent;