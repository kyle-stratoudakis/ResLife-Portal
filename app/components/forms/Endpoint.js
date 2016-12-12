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

class Endpoint extends Component {
	constructor(props) {
		super(props);

		this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
		this.enableButton = this.enableButton.bind(this);
		this.disableButton = this.disableButton.bind(this);
		this.handleSelection = this.handleSelection.bind(this);
		this.getActionButtons = this.getActionButtons.bind(this);
		this.notifyFormError = this.notifyFormError.bind(this);
		this.addJSONAction = this.addJSONAction.bind(this);
		this.removeJSONAction = this.removeJSONAction.bind(this);
		this.renderAction = this.renderAction.bind(this);
		this.onActionSelection = this.onActionSelection.bind(this);
		this.openActionDialog = this.openActionDialog.bind(this);
		this.renderActionSelection = this.renderActionSelection.bind(this);

		this.props.fetchMenuItems('administrator/get/selectionMenu?type=actions');

		this.state = {
			actions: [],
			name: '',
			note: '',
			route: '',
			actions: [],
			actionSelections: [],
			canSubmit: false,
			label: 'Submit',
			initialized: false,
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
				let endpoint = nextProps.details;
				this.setState({
					name: endpoint.name || '',
					note: endpoint.note || '',
					route: endpoint.route || '',
					actions: endpoint.actions || [],
					label: (endpoint._id ? 'Edit' : 'Submit'),
					initialized: true
				});
			}
		}
		if(nextProps.menuItems) {
			this.setState({
				actionSelections: this.props.menuItems.actions || [],
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
		console.error('Form error:', data);
		alert('Form could not be submitted, did you miss filling in something?');
	}

	addJSONAction(action) {
		let actions = this.state.dashActions;
		actions.push(action);
		this.setState({ dashActions: actions });
	}

	removeJSONAction(index) {
		let actionsArray = this.state.dashActions;
		let newActions = [];
		delete actionsArray[index];
		actionsArray.map((action) => newActions.push(action))
		this.setState({ dashActions: newActions });
	}

	renderAction(action, i) {
		let { listStyle, listPaperStyle, centerStyle } = this.state.styles;
		return (
			<Paper style={listPaperStyle} key={i}>
				<Subheader>{'Action '+(i+1)}</Subheader>
				<div style={listStyle}>
					<h2>{action.title}</h2>
					<h5>{action.type}</h5>
					<h5>{action.route}</h5>
					<h5>{action.note}</h5>
					<FormsyText 
						disabled={true}
						fullWidth={true}
						name={'actions['+i+']._id'}
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
						onClick={this.removeJSONAction.bind(this, i)}
						style={centerStyle}
					/>
				</center>
			</Paper>
		)
	}

	renderActionSelection(action, i) {
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
						onClick={this.onActionSelection.bind(this, i)}
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

	onActionSelection(i) {
		this.addJSONAction(this.state.actionSelections[i]);
		this.props.closeDialog();
	}

	openActionDialog(title, content, actions) {
		this.props.openDialog(title, content, actions);
	}

	render() {
		let { centerStyle } = this.state.styles;

		let dialogTitle = 'Select Action';

		const actionsContent = [
			<center>
				<FlatButton
					label='Create New Action'
					labelStyle={{fontSize: '1.5em'}}
					onClick={this.props.routeToTarget.bind(this, '/job/Administrator/New/Administrator/Action/', '_blank')}
					style={{margin: '1em'}}
				/>
			</center>
		]
		{this.state.actionSelections.map((action, i) => actionsContent.push(this.renderActionSelection(action, i)) )}

		const dialogActions = [
			<FlatButton
				key='cancel'
				label='Cancel'
				onClick={this.props.closeDialog.bind(this)}
			/>
		]

		return (
			<Formsy.Form
				ref='form'
				onValid={this.enableButton}
				onInvalid={this.disableButton}
				onValidSubmit={this.props.onSubmit.bind(this)}
				// onValidSubmit={this.submitForm}
				onInvalidSubmit={this.notifyFormError}
			>
				<br/>
				<Divider />
					<Subheader style={ {paddingBottom: '0.25em'} }>Endpoint Details</Subheader>
					<div style={centerStyle}>
						<FormsyText
							required
							fullWidth={true}
							name={'name'}
							hintText='Label shown on Tab'
							floatingLabelText='Name'
							value={this.state.name}
						/>
						<FormsyText
							fullWidth={true}
							multiLine={true}
							name={'note'}
							hintText='Descriptive note of purpose for endpoint'
							floatingLabelText='Note'
							value={this.state.note}
						/>
						<FormsyText
							fullWidth={true}
							multiLine={true}
							name={'route'}
							hintText='Route on the backend including GET parameters'
							floatingLabelText='Route'
							value={this.state.route}
						/>
					</div>

					<Divider />
					<Subheader style={ {paddingBottom: '0.25em'} }>Actions</Subheader>
					<div style={centerStyle}>
						{this.state.actions.map(this.renderAction)}
						<FlatButton
							icon={<FontIcon className='material-icons'>{'add'}</FontIcon>}
							type='button'
							label='Add Action'
							onClick={this.openActionDialog.bind(this, dialogTitle, actionsContent, dialogActions)}
						/>
					</div>

					<Divider />
					<br/>
					<div style={centerStyle}>
						{this.getActionButtons()}
					</div>
			</Formsy.Form>
		)
	}
}

export default FormWrapper(Endpoint);