import React, { Component } from 'react';
import { FormWrapper } from './formWrapper/';
import Formsy from 'formsy-react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon'
import {GridList, GridTile} from 'material-ui/GridList';
import { red500 } from 'material-ui/styles/colors';
import FormsyText from './formComponents/FormsyText';
import FormsyDate from './formComponents/FormsyDate';
import FormsyTime from './formComponents/FormsyTime';
import TrackProgram from './formComponents/TrackProgram' ;
import CommentSection from './formComponents/CommentSection';
import formatDate from '../../../utils/formatDate';
import {
	FormsyRadioGroup,
	FormsyRadio,
	FormsySelect
} from 'formsy-material-ui/lib';

class Job extends Component {
	
	constructor(props) {
		super(props)

		this.setState = this.setState.bind(this);
		this.render = this.render.bind(this);
		this.disableButton = this.disableButton.bind(this);
		this.enableButton = this.enableButton.bind(this);
		this.handleSelection = this.handleSelection.bind(this);
		this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
		this.getActionButtons = this.getActionButtons.bind(this);
		this.addJSONCardAction = this.addJSONCardAction.bind(this);
		this.removeJSONCardAction = this.removeJSONCardAction.bind(this);
		this.renderCardAction = this.renderCardAction.bind(this);
		this.addJSONDashAction = this.addJSONDashAction.bind(this);
		this.removeJSONDashAction = this.removeJSONDashAction.bind(this);
		this.renderDashAction = this.renderDashAction.bind(this);
		this.onDialogSelection = this.onDialogSelection.bind(this);
		this.openActionDialog = this.openActionDialog.bind(this);
		this.addJSONEndpoint = this.addJSONEndpoint.bind(this);
		this.removeJSONEndpoint = this.removeJSONEndpoint.bind(this);
		this.renderEndpoint = this.renderEndpoint.bind(this);
		this.renderEndpointSelection = this.renderEndpointSelection.bind(this);
		this.renderActionSelection = this.renderActionSelection.bind(this);

		this.props.fetchMenuItems('administrator/get/selectionMenu?type=actions&filter=ignore_modify');
		this.props.fetchMenuItems('administrator/get/selectionMenu?type=endpoints');

		this.state = {
			canSubmit: false,
			label: 'Submit',
			initialized: false,
			title: '',
			subtitle: '',
			role: '',
			link: '',
			note: '',
			endpoints: [],
			dashActions: [],
			cardActions: [],
			actionSelections: [],
			endpointSelections: [],
			styles: {
				centerStyle: {
					marginBottom: '1em',
					marginLeft: 'auto', 
					marginRight: 'auto', 
					width: '50%'
				},
				listStyle: {
					marginTop: '0em',
					paddingTop: '0em',
					paddingLeft: '1em',
					paddingRight: '1em'
				},
				listPaperStyle: {
					marginBottom: '1em'
				},
				actionStyle: {
					marginTop: '1em',
					marginRight: '2em'
				}
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.details._id) {
			if(!this.state.initialized) {
				let job = nextProps.details;
				this.setState({
					title: job.title || '',
					subtitle: job.subtitle || '',
					role: job.role || '',
					link: job.link || '',
					note: job.note || '',
					endpoints: job.endpoints || [],
					dashActions: job.dash_actions || [],
					cardActions: job.card_actions || [],
					label: (job._id ? 'Edit' : 'Submit'),
					initialized: true
				});
			}
		}
		if(nextProps.menuItems) {
			this.setState({
				actionSelections: this.props.menuItems.actions || [],
				endpointSelections: this.props.menuItems.endpoints || [],
			})
		}
	}

	enableButton() {
		this.setState({
			canSubmit: true,
		});
	}

	disableButton() {
		this.setState({
			canSubmit: false,
		});
	}

	handleSelection(e, value) {
		let data = {};
		data[e.target.name] = value;
		this.setState(data);
	}

	getActionButtons() {
		let { actionStyle } = this.state;
		return (
			<div>
				<RaisedButton
					style={actionStyle}
					type='submit'
					label={this.state.label}
				/>
			</div>
		)
	}

	submitForm(data) {
		alert(JSON.stringify(data, null, 4));
	}

	notifyFormError(data) {
		alert('Form could not submit, did you miss filling in a field?')
		console.error('Form error:', data);
	}

	addJSONEndpoint(endpoint) {
		let endpoints = this.state.endpoints;
		endpoints.push(endpoint);
		this.setState({ endpoints: endpoints });
	}

	removeJSONEndpoint(index) {
		let endpointsArray = this.state.endpoints;
		let newEndpoints = [];
		delete endpointsArray[index];
		endpointsArray.map((endpoint) => newEndpoints.push(endpoint))
		this.setState({ endpoints: newEndpoints });
	}

	renderEndpoint(endpoint, i) {
		let { listStyle, listPaperStyle, centerStyle } = this.state.styles;
		return (
			<Paper style={listPaperStyle} key={i}>
				<Subheader>{'Endpoint '+(i+1)}</Subheader>
				<div style={listStyle}>
					<h2>{endpoint.name}</h2>
					<h5>{endpoint.note}</h5>
					<h5>{endpoint.route}</h5>
					<FormsyText 
						disabled={true}
						fullWidth={true}
						name={'endpoints['+i+']._id'}
						floatingLabelText='ID'
						value={endpoint._id}
					/>
				</div>
				<center>
					<FlatButton
						label='View/Edit'
						onClick={this.props.routeToTarget.bind(this, '/job/Administrator/Edit/Administrator/Endpoint/'+endpoint._id, '_blank')}
						style={centerStyle}
					/>
					<FlatButton
						label='Remove'
						hoverColor={red500}
						disabled={(this.state.reviewed ? true : false)}
						onClick={this.removeJSONEndpoint.bind(this, i)}
						style={centerStyle}
					/>
				</center>
			</Paper>
		)
	}

	addJSONDashAction(action) {
		let actions = this.state.dashActions;
		actions.push(action);
		this.setState({ dashActions: actions });
	}

	removeJSONDashAction(index) {
		let actionsArray = this.state.dashActions;
		let newActions = [];
		delete actionsArray[index];
		actionsArray.map((action) => newActions.push(action))
		this.setState({ dashActions: newActions });
	}

	renderDashAction(action, i) {
		let { listStyle, listPaperStyle, centerStyle } = this.state.styles;
		return (
			<Paper style={listPaperStyle} key={i}>
				<Subheader>{'Dash Action '+(i+1)}</Subheader>
				<div style={listStyle}>
					<h2>{action.title}</h2>
					<h5>{action.type}</h5>
					<h5>{action.route}</h5>
					<h5>{action.note}</h5>
					<FormsyText 
						disabled={true}
						fullWidth={true}
						name={'dashActions['+i+']._id'}
						floatingLabelText='ID'
						value={action._id}
					/>	
				</div>
				<center>
					<FlatButton
						label='View/Edit'
						onClick={this.props.routeToTarget.bind(this, '/job/Administrator/Edit/Administrator/Action/'+action._id, '_blank')}
						style={centerStyle}
					/>
					<FlatButton
						label='Remove'
						hoverColor={red500}
						disabled={(this.state.reviewed ? true : false)}
						onClick={this.removeJSONDashAction.bind(this, i)}
						style={centerStyle}
					/>
				</center>
			</Paper>
		)
	}

	addJSONCardAction(action) {
		let actions = this.state.cardActions;
		actions.push(action);
		this.setState({ cardActions: actions });
	}

	removeJSONCardAction(index) {
		let actionsArray = this.state.cardActions;
		let newActions = [];
		delete actionsArray[index];
		actionsArray.map((action) => newActions.push(action))
		this.setState({ cardActions: newActions });
	}

	renderCardAction(action, i) {
		let { listStyle, listPaperStyle, centerStyle } = this.state.styles;
		return (
			<Paper style={listPaperStyle} key={i}>
				<Subheader>{'Card Action '+(i+1)}</Subheader>
				<div style={listStyle}>
					<h2>{action.title}</h2>
					<h5>{action.type}</h5>
					<h5>{action.route}</h5>
					<h5>{action.note}</h5>
					<FormsyText 
						disabled={true}
						fullWidth={true}
						name={'cardActions['+i+']._id'}
						floatingLabelText='ID'
						value={action._id}
					/>	
				</div>
				<center>
					<FlatButton
						label='View/Edit'
						onClick={this.props.routeToTarget.bind(this, '/job/Administrator/Edit/Administrator/Action/'+action._id, '_blank')}
						style={centerStyle}
					/>
					<FlatButton
						label='Remove'
						hoverColor={red500}
						disabled={(this.state.reviewed ? true : false)}
						onClick={this.removeJSONCardAction.bind(this, i)}
						style={centerStyle}
					/>
				</center>
			</Paper>
		)
	}

	renderEndpointSelection(endpoint, i, type) {
		let { listStyle, listPaperStyle, centerStyle } = this.state.styles;
		return (
			<div className='row' key={i}>
				<Divider />
				<div className='col-sm-10'>
					<h2>{endpoint.name}</h2>
					<h5>{endpoint.note}</h5>
					<h5><p>{endpoint.route}</p></h5>
					<br />
				</div>
				<div className='col-sm-2'>
					<br/>
					<br/>
					<FlatButton
						label='Select'
						onClick={this.onDialogSelection.bind(this, i, type)}
						style={centerStyle}
					/>
					<br/>
					<FlatButton
						label='View'
						onClick={this.props.routeToTarget.bind(this, '/job/Administrator/Edit/Administrator/Endpoint/'+endpoint._id, '_blank')}
						style={centerStyle}
					/>
				</div>	
			</div>
		)
	}

	renderActionSelection(action, i, type) {
		let { listStyle, listPaperStyle, centerStyle } = this.state.styles;
		return (
			<div className='row' key={i}>
				<Divider />
				<div className='col-sm-10'>
					<h2>{action.title}</h2>
					<h5>{action._id}</h5>
					<h5>{action.type}</h5>
					<h5>{action.route}</h5>
					<h5>{action.note}</h5>
					<br />
				</div>
				<div className='col-sm-2'>
					<br/>
					<br/>
					<FlatButton
						label='Select'
						onClick={this.onDialogSelection.bind(this, i, type)}
						style={centerStyle}
					/>
					<br/>
					<FlatButton
						label='View'
						onClick={this.props.routeToTarget.bind(this, '/job/Administrator/Edit/Administrator/Action/'+action._id, '_blank')}
						style={centerStyle}
					/>
				</div>	
			</div>
		)
	}

	onDialogSelection(i, type) {
		if(type === 'dashAction') {
			this.addJSONDashAction(this.state.actionSelections[i]);
		}
		else if(type === 'cardAction') {
			this.addJSONCardAction(this.state.actionSelections[i]);
		}
		else if(type === 'endpoint') {
			this.addJSONEndpoint(this.state.endpointSelections[i]);
		}
		this.props.closeDialog();
	}

	openActionDialog(title, content, actions) {
		this.props.openDialog(title, content, actions);
	}

	render() {
		let { centerStyle } = this.state.styles;

		const dialogTitle = 'Select Action';
		const endpointTitle = 'Select Endpoint';

		const dashActionsContent = [
			<center>
				<FlatButton
					label='Create New Action'
					labelStyle={{fontSize: '1.5em'}}
					onClick={this.props.routeToTarget.bind(this, '/job/Administrator/New/Administrator/Action/', '_blank')}
					style={{margin: '1em'}}
				/>
			</center>
		]
		{this.state.actionSelections.map((action, i) => dashActionsContent.push(this.renderActionSelection(action, i, 'dashAction')) )}

		const cardActionsContent = [];
		cardActionsContent.push(dashActionsContent[0]);
		{this.state.actionSelections.map((action, i) => cardActionsContent.push(this.renderActionSelection(action, i, 'cardAction')) )}

		const endpointContent = [
			<center>
				<FlatButton
					label='Create New Endpoint'
					labelStyle={{fontSize: '1.5em'}}
					onClick={this.props.routeToTarget.bind(this, '/job/Administrator/New/Administrator/Endpoint/', '_blank')}
					style={{margin: '1em'}}
				/>
			</center>
		]
		{this.state.endpointSelections.map((endpoint, i) => endpointContent.push(this.renderEndpointSelection(endpoint, i, 'endpoint')) )}

		const dialogActions = [
			<FlatButton
				key='cancel'
				label='Cancel'
				onClick={this.props.closeDialog.bind(this)}
			/>
		]

		return (
			<div>
				<br />
				<Divider />
				<Formsy.Form
					ref='form'
					onValid={this.enableButton}
					onInvalid={this.disableButton}
					onValidSubmit={this.props.onSubmit.bind(this)}
					// onValidSubmit={this.submitForm}
					onInvalidSubmit={this.notifyFormError}
				>
					<Divider />
					<Subheader style={ {paddingBottom: '0.25em'} }>Job Details</Subheader>
					<div style={centerStyle}>
						<FormsyText
							required
							fullWidth={true}
							name='jobTitle'
							hintText='Title displayed on appbar'
							floatingLabelText='Title'
							value={this.state.title}
						/>
						<FormsyText
							fullWidth={true}
							name='jobSubtitle'
							hintText='subtitle displayed on job card'
							floatingLabelText='subtitle'
							value={this.state.subtitle}
						/>
						<FormsyText
							required
							fullWidth={true}
							name='jobRole'
							hintText='Role within applications workflow'
							floatingLabelText='Role'
							value={this.state.role}
						/>
						<FormsyText
							required
							fullWidth={true}
							name='jobLink'
							hintText='Name of application used in routing'
							floatingLabelText='Link'
							value={this.state.link}
						/>
						<FormsyText
							fullWidth={true}
							multiLine={true}
							name='jobNote'
							hintText='Descriptive Note'
							floatingLabelText='Note'
							value={this.state.note}
						/>
					</div>

					<Divider />
					<Subheader style={{paddingBottom: '0.25em'}}>Endpoints</Subheader>
					<div style={centerStyle}>
						{this.state.endpoints.map(this.renderEndpoint)}
						<FlatButton
							icon={<FontIcon className='material-icons'>{'add'}</FontIcon>}
							type='button'
							label='Add Endpoint'
							onClick={this.openActionDialog.bind(this, endpointTitle, endpointContent, dialogActions)}
						/>
					</div>

					<Divider />
					<Subheader style={{paddingBottom: '0.25em'}}>Dash Actions</Subheader>
					<div style={centerStyle}>
						{this.state.dashActions.map(this.renderDashAction)}
						<FlatButton
							icon={<FontIcon className='material-icons'>{'add'}</FontIcon>}
							type='button'
							label='Add Dash Action'
							onClick={this.openActionDialog.bind(this, dialogTitle, dashActionsContent, dialogActions)}
						/>
					</div>

					<Divider />
					<Subheader style={{paddingBottom: '0.25em'}}>Card Actions</Subheader>
					<div style={centerStyle}>
						{this.state.cardActions.map(this.renderCardAction)}
						<FlatButton
							icon={<FontIcon className='material-icons'>{'add'}</FontIcon>}
							type='button'
							label='Add Card Action'
							onClick={this.openActionDialog.bind(this, dialogTitle, cardActionsContent, dialogActions)}
						/>
					</div>
					<Divider />
					<br/>
					<div style={centerStyle}>
						{this.getActionButtons()}
					</div>
				</Formsy.Form>
			</div>
		);
	}
}

export default FormWrapper(Job);