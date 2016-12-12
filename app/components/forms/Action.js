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

class Action extends Component {
	constructor(props) {
		super(props);

		this.render = this.render.bind(this);
		this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
		this.enableButton = this.enableButton.bind(this);
		this.disableButton = this.disableButton.bind(this);
		this.handleSelection = this.handleSelection.bind(this);
		this.getActionButtons = this.getActionButtons.bind(this);
		this.submitForm = this.submitForm.bind(this);
		this.notifyFormError = this.notifyFormError.bind(this);

		this.state = {
			type: '',
			title: '',
			route: '',
			icon: '',
			note: '',
			color: '',
			hoverColor: '',
			canSubmit: false,
			label: 'Submit',
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
				let action = nextProps.details;
				this.setState({
					type: action.type || '',
					title: action.title || '',
					route: action.route || '',
					icon: action.icon || '',
					note: action.note || '',
					color: action.color || '',
					hoverColor: action.hover_color || '',
					label: (action._id ? 'Edit' : 'Submit')
				});
			}
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

	render() {
		let { centerStyle } = this.state.styles;
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
					<Subheader style={ {paddingBottom: '0.25em'} }>Action Details</Subheader>
					<div style={centerStyle}>
						<FormsyText
							required
							fullWidth={true}
							name='title'
							hintText='Primary text on buttons'
							floatingLabelText='Title'
							value={this.state.title}
						/>

						<FormsyText
							fullWidth={true}
							multiLine={true}
							name='note'
							hintText='Descriptive note to describe purpose of endpoint'
							floatingLabelText='Note'
							value={this.state.note}
						/>
					</div>

					<Divider />
					<Subheader style={ {paddingBottom: '0.25em'} }>Frontend setting</Subheader>
					<div style={centerStyle}>
						<FormsySelect
							required
							fullWidth={true}
							name='type'
							floatingLabelText='Type'
							value={this.state.type}
						>
							<MenuItem value='route' primaryText='Route' />
							<MenuItem value='modify' primaryText='Modify' />
							<MenuItem value='download' primaryText='Download' />
						</FormsySelect>	

						<FormsyText
							fullWidth={true}
							name='route'
							hintText='Route on the backend including GET parameters'
							floatingLabelText='Route'
							value={this.state.route}
						/>
					</div>

					<Divider />
					<Subheader style={ {paddingBottom: '0.25em'} }>Display Settings</Subheader>
					<div style={centerStyle}>
						<FormsyText
							fullWidth={true}
							name='icon'
							hintText='Name of font icon dispayed on buttons'
							floatingLabelText='icon'
							value={this.state.icon}
						/>

						<div className='row'>
							<div className='col-sm-6'>
								<FormsyText
									required
									fullWidth={true}
									name='color'
									hintText='Primary button color'
									floatingLabelText='Primary Color'
									value={this.state.color}
								/>
							</div>
							<div className='col-sm-6' style={ {backgroundColor: this.state.color, height: '4em', borderRadius: '0.25em'} }></div>
						</div>
						<br/>
						<div className='row'>
							<div className='col-sm-6'>
								<FormsyText
									required
									fullWidth={true}
									name='hoverColor'
									hintText='Color on button hover'
									floatingLabelText='Hover Color'
									value={this.state.hoverColor}
								/>
							</div>
							<div className='col-sm-6' style={ {backgroundColor: this.state.hoverColor, height: '4em', borderRadius: '0.25em'} }></div>
						</div>
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

export default FormWrapper(Action);