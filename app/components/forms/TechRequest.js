import React, { Component } from 'react';
import Formsy from 'formsy-react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon'
import { red500 } from 'material-ui/styles/colors';
import FormsyText from './Formsy/FormsyText';
import FormsyDate from './Formsy/FormsyDate';
import FormsyTime from './Formsy/FormsyTime';
import { FormsySelect } from 'formsy-material-ui/lib';

class TechRequest extends Component{
	constructor(props) {
		super(props)

		this.disableButton = this.disableButton.bind(this);
		this.enableButton = this.enableButton.bind(this);
		this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);

		this.state = {
			canSubmit: false,
			title: '',
			type: '',
			location: '',
			description: '',
			label: 'Submit',
			styles: {
				centerStyle: {
					marginBottom: '1em',
					marginLeft: 'auto', 
					marginRight: 'auto', 
					width: '50%'
				},
				switchStyle: {
					marginBottom: 16,
				},
				submitStyle: {
					marginTop: 32,
				},
				listStyle: {
					marginLeft: '1em',
					marginRight: '1em',
					padding: 'none'
				},
				listPaperStyle: {
					marginBottom: '1em'
				}
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.workOrder) {
			let workOrder = nextProps.workOrder;
			this.setState({
				title: workOrder.title || '',
				type: workOrder.type || '',
				description: workOrder.description || '',
				label: (workOrder._id ? 'Edit' : 'Submit')
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

	submitForm(data) {
		alert(JSON.stringify(data, null, 4));
	}

	notifyFormError(data) {
		console.error('Form error:', data);
	}

	render() {
		let { centerStyle, switchStyle, submitStyle } = this.state.styles;
		
		return (
			<Formsy.Form
				ref="form"
				onValid={this.enableButton}
				onInvalid={this.disableButton}
				onValidSubmit={this.props.onSubmit.bind(this)}
				// onValidSubmit={this.submitForm}
				onInvalidSubmit={this.notifyFormError}
			>
				<Divider />
				<Subheader>Request Details</Subheader>

				<div style={centerStyle}>
					<FormsyText
						name='title'
						required
						fullWidth={true}
						hintText='Descriptive Request title?'
						floatingLabelText='Title'
						value={this.state.title}
					/>

					<FormsySelect
						name='type'
						required
						fullWidth={true}
						floatingLabelText='Type'
						value={this.state.type}
					>
						<MenuItem value='error' primaryText='Report Error' />
						<MenuItem value='feature' primaryText='Feature Request' />
						<MenuItem value='name' primaryText='Change Display name' />
						<MenuItem value='other' primaryText='Other' />
					</FormsySelect>
				</div>

				<div style={centerStyle}>
					<FormsyText
						name='description'
						required
						fullWidth={true}
						hintText='Pleas provide as much detail as possible'
						floatingLabelText='Description'
						multiLine={true}
						rows={2}
						value={this.state.description}
					/>
				</div>

				<Divider />

				<div style={centerStyle}>
					<RaisedButton
						style={submitStyle}
						type='submit'
						label={this.state.label}
						// disabled={!this.state.canSubmit}
					/>
				</div>
			</Formsy.Form>
		);
	}
}

export default TechRequest;