import React, { Component } from 'react';
import { FormWrapper } from './formWrapper/';
import Formsy from 'formsy-react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
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
import ManageEndpoints from './formComponents/ManageEndpoints';
import ManageActions from './formComponents/ManageActions';
import formatDate from '../../../utils/formatDate';
import {
	FormsyRadioGroup,
	FormsyRadio,
	FormsySelect
} from 'formsy-material-ui/lib';

class Job extends Component {
	constructor(props) {
		super(props)

		this.disableButton = this.disableButton.bind(this);
		this.enableButton = this.enableButton.bind(this);
		this.handleSelection = this.handleSelection.bind(this);
		this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
		this.getActionButtons = this.getActionButtons.bind(this);

		this.state = {
			canSubmit: false,
			label: 'Submit',
			title: '',
			subTitle: '',
			role: '',
			link: '',
			note: '',
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
		if(nextProps.workOrder) {
			let wo = nextProps.workOrder;
			(wo.date ? new Date(wo.date) : {})
			this.setState({
				label: (wo._id ? 'Edit' : 'Submit')
			});
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
	}

	sortColors() {
		let colorMenu = [];
		for (var i = 0; i < Colors.length; i++) {
			colorMenu[Colors[i]] = Colors[i]
		}
	}

	render() {
		let { centerStyle } = this.state.styles;
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
							name='title'
							hintText='Title displayed on appbar'
							floatingLabelText='Title'
							value={this.state.title}
						/>
						<FormsyText
							required
							fullWidth={true}
							name='subTitle'
							hintText='Subtitle displayed on job card'
							floatingLabelText='Subtitle'
							value={this.state.subTitle}
						/>
						<FormsyText
							required
							fullWidth={true}
							name='role'
							hintText='Role within applications workflow'
							floatingLabelText='Role'
							value={this.state.role}
						/>
						<FormsyText
							required
							fullWidth={true}
							name='link'
							hintText='Name of application used in routing'
							floatingLabelText='Link'
							value={this.state.link}
						/>
						<FormsyText
							required
							fullWidth={true}
							multiLine={true}
							name='note'
							hintText='Descriptive Note'
							floatingLabelText='Note'
							value={this.state.note}
						/>
					</div>

					<Divider />
					<Subheader style={{paddingBottom: '0.25em'}}>Endpoints</Subheader>
					<div style={centerStyle}>
						<ManageEndpoints
							styles={this.state.styles}
						/>
					</div>

					<Divider />
					<Subheader style={{paddingBottom: '0.25em'}}>Dash Actions</Subheader>
					<div style={centerStyle}>
						<ManageActions
							styles={this.state.styles}
						/>
					</div>

					<Divider />
					<Subheader style={{paddingBottom: '0.25em'}}>Card Actions</Subheader>
					<div style={centerStyle}>
						<ManageActions
							styles={this.state.styles}
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