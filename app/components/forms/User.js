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

class User extends Component {
	constructor(props) {
		super(props)

		this.render = this.render.bind(this);
		this.disableButton = this.disableButton.bind(this);
		this.enableButton = this.enableButton.bind(this);
		this.handleSelection = this.handleSelection.bind(this);
		this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
		this.getActionButtons = this.getActionButtons.bind(this);
		this.addJSONNotifRole = this.addJSONNotifRole.bind(this);
		this.removeJSONNotifRole = this.removeJSONNotifRole.bind(this);
		this.renderNotifRole = this.renderNotifRole.bind(this);
		this.addJSONNotifTime = this.addJSONNotifTime.bind(this);
		this.removeJSONNotifTime = this.removeJSONNotifTime.bind(this);
		this.renderNotifTime = this.renderNotifTime.bind(this);
		this.addJSONJob = this.addJSONJob.bind(this);
		this.removeJSONJob = this.removeJSONJob.bind(this);
		this.renderJob = this.renderJob.bind(this);
		this.renderJobSelection = this.renderJobSelection.bind(this);
		this.openJobSelectionDialog = this.openJobSelectionDialog.bind(this);
		this.onJobSelectionChange = this.onJobSelectionChange.bind(this);

		this.props.fetchMenuItems('administrator/get/selectionMenu?type=jobs&filter=no_custom_jobs');

		this.state = {
			canSubmit: false,
			label: 'Submit',
			initialized: false,
			name: '',
			username: '',
			email: '',
			primaryContact: '',
			hall: '',
			notifRoles: [],
			notifTimes: [],
			jobs: [],
			banned: null,
			jobSelections: [],
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
			if(!this.state.initialized){
				let user = nextProps.details;
				this.setState({
					name: user.name || '',
					username: user.username || '',
					email: user.email || '',
					primaryContact: user.primary_contact || '',
					hall: user.hall || '',
					notifRoles: user.notifRoles || [],
					notifTimes: user.notifTimes || [],
					jobs: user.jobs || [],
					banned: user.banned || null,
					label: (user._id ? 'Edit' : 'Submit'),
					initialized: true
				});
			}
		}
		if(nextProps.menuItems) {
			this.setState({
				jobSelections: this.props.menuItems.jobs || [],
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

	addJSONNotifRole() {
		let roles = this.state.notifRoles;
		roles.push(null);
		this.setState({ notifRoles: roles });
	}

	removeJSONNotifRole(index) {
		let rolesArray = this.refs.form.getModel().notifRoles;
		let newRoles = [];
		delete rolesArray[index];
		rolesArray.map((role) => newRoles.push(role))
		this.setState({ notifRoles: newRoles });
	}

	renderNotifRole(role, i) {
		let { listStyle, listPaperStyle, centerStyle } = this.state.styles;
		return (
			<Paper style={listPaperStyle} key={i}>
				<div style={listStyle}>
					<FormsySelect
						required
						fullWidth={true}
						name={'notifRoles['+i+']'}
						floatingLabelText='Notification Role'
						value={role}
					>	
						<MenuItem value={null} primaryText='' />
						<MenuItem value={'reviewer'} primaryText='reviewer' />
						<MenuItem value={'Central_Office_new'} primaryText='Central_Office_new' />
						<MenuItem value={'Central_Office_reviewer'} primaryText='Central_Office_reviewer' />
						<MenuItem value={'Chase_reviewer'} primaryText='Chase_reviewer' />
						<MenuItem value={'Farnham_reviewer'} primaryText='Farnham_reviewer' />
						<MenuItem value={'Hickerson_reviewer'} primaryText='Hickerson_reviewer' />
						<MenuItem value={'Neff_reviewer'} primaryText='Neff_reviewer' />
						<MenuItem value={'West_reviewer'} primaryText='West_reviewer' />
						<MenuItem value={'Wilkinson_reviewer'} primaryText='Wilkinson_reviewer' />
						<MenuItem value={'rha_new'} primaryText='rha_new' />
						<MenuItem value={'farnham_new'} primaryText='farnham_new' />
						<MenuItem value={role} primaryText={role} />
					</FormsySelect>	
					<br />
				</div>
				<center>
					<FlatButton
						label='Remove'
						hoverColor={red500}
						disabled={(this.state.reviewed ? true : false)}
						onClick={this.removeJSONNotifRole.bind(this, i)}
						style={centerStyle}
					/>
				</center>
			</Paper>
		)
	}

	addJSONNotifTime() {
		let times = this.state.notifTimes;
		times.push(null);
		this.setState({ notifTimes: times });
	}

	removeJSONNotifTime(index) {
		let tilesArray = this.refs.form.getModel().notifTimes;
		let newTimes = [];
		delete tilesArray[index];
		tilesArray.map((time) => newTimes.push(time))
		this.setState({ notifTimes: newTimes });
	}

	renderNotifTime(time, i) {
		let { listStyle, listPaperStyle, centerStyle } = this.state.styles;
		return (
			<Paper style={listPaperStyle} key={i}>
				<div style={listStyle}>
					<FormsySelect
						required
						fullWidth={true}
						name={'notifTimes['+i+']'}
						floatingLabelText='Notification Time'
						value={time}
					>
						<MenuItem value={null} primaryText='' />
						<MenuItem value={1} primaryText='1 am' />
						<MenuItem value={2} primaryText='2 am' />
						<MenuItem value={3} primaryText='3 am' />
						<MenuItem value={4} primaryText='4 am' />
						<MenuItem value={5} primaryText='5 am' />
						<MenuItem value={6} primaryText='6 am' />
						<MenuItem value={7} primaryText='7 am' />
						<MenuItem value={8} primaryText='8 am' />
						<MenuItem value={9} primaryText='9 am' />
						<MenuItem value={10} primaryText='10 am' />
						<MenuItem value={11} primaryText='11 am' />
						<MenuItem value={12} primaryText='12 pm' />
						<MenuItem value={13} primaryText='1 pm' />
						<MenuItem value={14} primaryText='2 pm' />
						<MenuItem value={15} primaryText='3 pm' />
						<MenuItem value={16} primaryText='4 pm' />
						<MenuItem value={17} primaryText='5 pm' />
						<MenuItem value={18} primaryText='6 pm' />
						<MenuItem value={19} primaryText='7 pm' />
						<MenuItem value={20} primaryText='8 pm' />
						<MenuItem value={21} primaryText='9 pm' />
						<MenuItem value={22} primaryText='10 pm' />
						<MenuItem value={23} primaryText='11 pm' />
					</FormsySelect>
					<br />
				</div>
				<center>
					<FlatButton
						label='Remove'
						hoverColor={red500}
						onClick={this.removeJSONNotifTime.bind(this, i)}
						style={centerStyle}
					/>
				</center>
			</Paper>
		)
	}

	addJSONJob(job) {
		let jobs = this.state.jobs;
		jobs.push(job);
		this.setState({ jobs: jobs });
	}

	removeJSONJob(index) {
		let jobsArray = this.state.jobs;
		let newJobs = [];
		delete jobsArray[index];
		jobsArray.map((job) => newJobs.push(job));
		this.setState({ jobs: newJobs });
	}

	renderJob(job, i) {
		let { listStyle, listPaperStyle, centerStyle } = this.state.styles;
		return (
			<Paper style={listPaperStyle} key={i}>
				<Subheader>{'Job '+(i+1)}</Subheader>
				<div style={listStyle}>
					<h2>{job.title}</h2>
					<h5>{job.role}</h5>
					<h5>{job.note}</h5>
					<h5>{'Endpoints ' + job.endpoints.length}</h5>
					<h5>{'Card Actions ' + job.card_actions.length}</h5>
					<h5>{'Dash Actions ' + job.dash_actions.length}</h5>
					<FormsyText 
						disabled={true}
						fullWidth={true}
						multiline={true}
						name={'jobs['+i+']._id'}
						floatingLabelText='ID'
						value={job._id}
					/>	
					<br />
				</div>
				<center>
					<FlatButton
						label='View/Edit'
						onClick={this.props.routeToTarget.bind(this, '/job/Administrator/Edit/Administrator/Job/'+job._id, '_blank')}
						style={centerStyle}
					/>
					<FlatButton
						label='Remove'
						hoverColor={red500}
						onClick={this.removeJSONJob.bind(this, i)}
						style={centerStyle}
					/>
				</center>
			</Paper>
		)
	}

	renderJobSelection(job, i) {
		let { listStyle, listPaperStyle, centerStyle } = this.state.styles;
		return (
			<div className='row' key={i}>
				<Divider />
				<div className='col-sm-10'>
					<h2>{job.title}</h2>
					<h5>{job.role}</h5>
					<h5>{job.note}</h5>
					<h5>{'Endpoints ' + job.endpoints.length}</h5>
					<h5>{'Card Actions ' + job.card_actions.length}</h5>
					<h5>{'Dash Actions ' + job.dash_actions.length}</h5>
					<h5>{job._id}</h5>
					<br />
				</div>
				<div className='col-sm-2'>
					<br/>
					<br/>
					<FlatButton
						label='Select'
						onClick={this.onJobSelectionChange.bind(this, i)}
						style={centerStyle}
					/>
					<br/>
					<FlatButton
						label='View'
						onClick={this.props.routeToTarget.bind(this, '/job/Administrator/Edit/Administrator/Job/'+job._id, '_blank')}
						style={centerStyle}
					/>
				</div>	
			</div>
		)
	}

	openJobSelectionDialog(title, content, actions) {
		this.props.openDialog(title, content, actions);
	}

	onJobSelectionChange(i) {
		this.addJSONJob(this.state.jobSelections[i]);
		this.props.closeDialog();
	}

	render() {
		const title = 'Select Job';

		const content = [
			<center>
				<FlatButton
					label='Create New Job'
					labelStyle={{fontSize: '1.5em'}}
					onClick={this.props.routeToTarget.bind(this, '/job/Administrator/New/Administrator/Job/', '_blank')}
					style={{margin: '1em'}}
				/>
			</center>
		]
		{this.state.jobSelections.map((job, i) => content.push(this.renderJobSelection(job, i)) )}


		const actions = [
			<FlatButton
				key='cancel'
				label='Cancel'
				onClick={this.props.closeDialog.bind(this)}
			/>
		]

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
					<Subheader style={ {paddingBottom: '0.25em'} }>User Details</Subheader>
					<div style={centerStyle}>
						<FormsyText
							required
							fullWidth={true}
							name='name'
							hintText='First Last'
							floatingLabelText='Full Name'
							value={this.state.name}
						/>
						<FormsyText
							required
							fullWidth={true}
							name='username'
							hintText='MySCSU Username'
							floatingLabelText='Username'
							value={this.state.username}
						/>
						<FormsyText
							required
							fullWidth={true}
							name='email'
							hintText='Email for notifications'
							floatingLabelText='Email'
							value={this.state.email}
						/>
						<FormsyText
							required
							fullWidth={true}
							name='primary_contact'
							hintText='Contact phone number'
							floatingLabelText='Phone Number'
							value={this.state.primaryContact}
						/>
					</div>

					<Divider />
					<Subheader style={ {paddingBottom: '0.25em'} }>Hall Assignment</Subheader>
					<div style={centerStyle}>
						<FormsySelect
							required
							fullWidth={true}
							name='hall'
							floatingLabelText='Hall'
							value={this.state.hall}
						>
							<MenuItem value='Central_Office' primaryText='Central Office' />
							<MenuItem value='Brownell' primaryText='Brownell' />
							<MenuItem value='Chase' primaryText='Chase' />
							<MenuItem value='Farnham' primaryText='Farnham' />
							<MenuItem value='Hickerson' primaryText='Hickerson' />
							<MenuItem value='Neff' primaryText='Neff' />
							<MenuItem value='North' primaryText='North (Townhouse or Midrise)' />
							<MenuItem value='Schwartz' primaryText='Schwartz' />
							<MenuItem value='West' primaryText='West Campus' />
							<MenuItem value='Wilkinson' primaryText='Wilkinson' />
						</FormsySelect>
					</div>

					<Divider />
					<Subheader style={ {paddingBottom: '0.25em'} }>Notification Settings</Subheader>
					<div style={centerStyle}>
						<Subheader>{'Notification Roles'}</Subheader>
						{this.state.notifRoles.map(this.renderNotifRole)}
						<FlatButton
							icon={<FontIcon className='material-icons'>{'add'}</FontIcon>}
							type='button'
							label='Add Role'
							onClick={this.addJSONNotifRole.bind(this)}
						/>
						<br/>
						<br/>
						<Subheader>{'Notification Times'}</Subheader>
						{this.state.notifTimes.map(this.renderNotifTime)}
						<FlatButton
							icon={<FontIcon className='material-icons'>{'add'}</FontIcon>}
							type='button'
							label='Add Time'
							onClick={this.addJSONNotifTime.bind(this)}
						/>
					</div>

					<Divider />
					<Subheader style={ {paddingBottom: '0.25em'} }>Job Assignment</Subheader>
					<div style={centerStyle}>
						{this.state.jobs.map((job, i) => this.renderJob(job, i))}
						<FlatButton
							icon={<FontIcon className='material-icons'>{'add'}</FontIcon>}
							type='button'
							label='Add Job'
							onClick={this.openJobSelectionDialog.bind(this, title, content, actions)}
						/>
					</div>

					<Divider />
					<Subheader style={ {paddingBottom: '0.25em'} }>Login Permission</Subheader>
					<div style={centerStyle}>
						<FormsySelect
							required
							fullWidth={true}
							name='banned'
							floatingLabelText='Select Banned Status'
							value={this.state.banned}
						>
							<MenuItem value={null} primaryText='' />
							<MenuItem value={false} primaryText='Not Banned' />
							<MenuItem value={true} primaryText='Banned' />
						</FormsySelect>
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

export default FormWrapper(User);