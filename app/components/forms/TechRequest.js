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
import FormsyText from './formComponents/FormsyText';
import FormsyDate from './formComponents/FormsyDate';
import FormsyTime from './formComponents/FormsyTime';
import { FormsySelect } from 'formsy-material-ui/lib';
import { FormWrapper } from './formWrapper/';
import TrackTech from './formComponents/TrackTech' ;
import CommentSection from './formComponents/CommentSection';
import formatDate from '../../../utils/formatDate';

class TechRequest extends Component{
	constructor(props) {
		super(props)

		this.disableButton = this.disableButton.bind(this);
		this.enableButton = this.enableButton.bind(this);
		this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
		this.getActionButtons = this.getActionButtons.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleComment = this.handleComment.bind(this);

		this.state = {
			canSubmit: false,
			title: '',
			type: '',
			description: '',
			label: 'Submit',
			comments: [],
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
			let workOrder = nextProps.workOrder;
			this.setState({
				title: workOrder.title || '',
				type: workOrder.type || '',
				description: workOrder.description || '',
				comments: workOrder.comments || [],
				label: (workOrder._id ? 'Edit' : 'Submit')
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

	notifyFormError(data) {
		alert('There was an error submitting the form, check that all required fields are filled and try again. If you are still having issues email reslifeportal@southernct.edu');
		console.error('Form error:', data);
	}

	getActionButtons() {
		let location = this.props.params['_job'];
		let index = this.props.jobs.findIndex((job) => job.link === location);
		let jobId = this.props.jobs[index]._id;
		let role = this.props.jobs[index].role;
		let { closed } = this.state;
		let { actionStyle } = this.state.styles;
		let data = {
			id: this.props.details._id,
			jobId: jobId,
			jwt: this.props.token.jwt
		}
		let disabled;
		let title = 'Close Request';
		let content = [
			<center>
				<p>Please enter a reason which will be included in an email sent to the submitter.</p>
				<Formsy.Form
					ref='closeForm'
				>
					<FormsyText
						ref='closeComment'
						name='closeComment'
						floatingLabelText='Close Comment'
						multiLine={true}
						style={{textAlign: 'left'}}
					/>
				</Formsy.Form>
			</center>
		];
		const actions = [
			<FlatButton
				label='Cancel'
				key='cancel'
				onClick={this.props.closeDialog.bind(this)}
			/>,
			<FlatButton
				label='Close'
				key='close'
				hoverColor='#ef5350'
				onClick={this.handleClose.bind()}
			/>,
		];

		if(!(role === 'submitter') && this.props.details._id) {
			if(role === 'technician'){
				disabled = (closed ? true : false);
			}
			return (
				<div>
					<RaisedButton
						style={actionStyle}
						type='submit'
						label={this.state.label}
					/>
					<FlatButton
						style={actionStyle}
						label='Close'
						backgroundColor='#ef9a9a'
						hoverColor='#ef5350'
						onClick={this.props.openDialog.bind(this, title, content, actions)}
					/>
				</div>
			)
		}
		else {
			return (
				<RaisedButton
					style={actionStyle}
					type='submit'
					label={this.state.label}
				/>
			)
		}
	}

	handleClose() {
		let location = this.props.params['_job'];
		let index = this.props.jobs.findIndex((job) => job.link === location);
		let jobId = this.props.jobs[index]._id;
		let comment = (this.refs.closeComment ? this.refs.closeComment.getValue() : '');
		let data = {
			id: this.props.details._id,
			jobId: jobId,
			jwt: this.props.token.jwt,
			comment: comment
		}
		this.props.workorderAction('techsupport/put/close', data, 'TechSupport');
	}

	handleComment(comment) {
		let location = this.props.params['_job'];
		let index = this.props.jobs.findIndex((job) => job.link === location);
		let jobId = this.props.jobs[index]._id;
		let data = {
			id: this.props.details._id,
			jobId: jobId,
			jwt: this.props.token.jwt,
			comment: comment
		}
		if(comment > '') this.props.comment(data, 'TechSupport');
	}

	render() {
		let { centerStyle } = this.state.styles;
		return (
			<div>
				<br />
				<Divider />
				<Subheader>Request Tracker</Subheader>
				<div style={centerStyle}>
					<TrackTech workOrder={this.props.details} size={screen.width}/>
				</div>
				<Formsy.Form
					ref="form"
					onValid={this.enableButton}
					onInvalid={this.disableButton}
					onValidSubmit={this.props.onSubmit.bind(this)}
					onInvalidSubmit={this.notifyFormError}
				>
					<br />
					<Divider />
					<Subheader>Request Details</Subheader>

					<div style={centerStyle}>
						<FormsyText
							required
							name='title'
							fullWidth={true}
							hintText='Descriptive Request title?'
							floatingLabelText='Title'
							value={this.state.title}
						/>

						<FormsySelect
							required
							name='type'
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
							required
							name='description'
							fullWidth={true}
							hintText='Please provide as much detail as possible'
							floatingLabelText='Description'
							multiLine={true}
							value={this.state.description}
						/>
					</div>

					<CommentSection 
						enable={(this.props.details._id ? true : false)}
						comments={this.state.comments} 
						handleComment={this.handleComment}
						userId={this.props.token.user._id}
						styles={this.state.styles}
					/>

					<Divider />
					<Subheader>Actions</Subheader>
					<div style={centerStyle}>
						{this.getActionButtons()}
					</div>
				</Formsy.Form>
			</div>
		);
	}
}

export default FormWrapper(TechRequest);