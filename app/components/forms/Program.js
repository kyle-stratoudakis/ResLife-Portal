import React, { Component } from 'react';
import { FormWrapper } from '../FormWrapper/';
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
import TrackProgram from '../TrackProgram' ;
import {
	FormsyRadioGroup,
	FormsyRadio,
	FormsySelect
} from 'formsy-material-ui/lib';

class Program extends Component {
	constructor(props) {
		super(props)

		this.disableButton = this.disableButton.bind(this);
		this.enableButton = this.enableButton.bind(this);
		this.renderItem = this.renderItem.bind(this);
		this.renderStaff = this.renderStaff.bind(this);
		this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
		this.renderCostTotal = this.renderCostTotal.bind(this);
		this.getActionButtons = this.getActionButtons.bind(this);
		this.renderSearchId = this.renderSearchId.bind(this);
		this.formatDate = this.formatDate.bind(this);
		this.renderTypeContent = this.renderTypeContent.bind(this);
		this.renderEvaluation = this.renderEvaluation.bind(this);
		this.renderQuote = this.renderQuote.bind(this);
		this.handleSelection = this.handleSelection.bind(this);
		this.renderDenyDialog = this.renderDenyDialog.bind(this);
		this.handleDeny = this.handleDeny.bind(this);
		this.renderAddComment = this.renderAddComment.bind(this);
		this.renderEvalContent = this.renderEvalContent.bind(this);

		this.state = {
			canSubmit: false,
			searchId: null,
			title: '',
			type: '',
			location: '',
			outcomes:'',
			description: '',
			label: 'Submit',
			fundingType: 'pcard',
			department: '',
			items: [],
			staff: [],
			date: {},
			time: {},
			checked: null,
			reviewed: null,
			approved: null,
			evaluated: null,
			councilDate: {},
			councilMotioned: '',
			councilSeconded: '',
			councilFavor: '',
			councilOpposed: '',
			councilAbstained: '',
			councilApproval: '',
			evalTime: {},
			evalAttendance: '',
			evalCost: '',
			evalCardReturn: '',
			evalOutcomes: '',
			evalStrengths: '',
			evalWeaknesses: '',
			evalSuggestions: '',
			evalOther: '',
			travelAuthorization: 'onCampus',
			chartwellsQuote: '',
			performEval: false,
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
					paddingLeft: '1em'
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
				searchId: wo.searchId || null,
				title: wo.title || '',
				date: (wo.date ? new Date(wo.date) : {}),
				time: (wo.time ? new Date(wo.time) : {}),
				type: wo.type || '',
				location: wo.location || '',
				outcomes: wo.outcomes || '',
				description: wo.description || '',
				department: wo.department || '',
				fundingType: wo.fundingType || 'pcard',
				items: (wo.items ? JSON.parse(wo.items) : []),
				staff: (wo.staff ? JSON.parse(wo.staff) : []),
				checked: wo.checked,
				reviewed: wo.reviewed,
				approved: wo.approved,
				evaluated: wo.evaluated,
				councilDate: (wo.councilDate ? new Date(wo.councilDate) : {}),
				councilMotioned: wo.councilMotioned || '',
				councilSeconded: wo.councilSeconded || '',
				councilFavor: wo.councilFavor || '',
				councilOpposed: wo.councilOpposed || '',
				councilAbstained: wo.councilAbstained || '',
				councilApproval: wo.councilApproval || '',
				evalTime: (wo.evalTime ? new Date(wo.evalTime) : {}),
				evalAttendance: wo.evalAttendance || '',
				evalCost: wo.evalCost || '',
				evalCardReturn: wo.evalCardReturn || '',
				evalOutcomes: wo.evalOutcomes || '',
				evalStrengths: wo.evalStrengths || '',
				evalWeaknesses: wo.evalWeaknesses || '',
				evalSuggestions: wo.evalSuggestions || '',
				evalOther: wo.evalOther || '',
				travelAuthorization: wo.travelAuthorization || 'onCampus',
				chartwellsQuote: wo.chartwellsQuote || '',
				label: (wo._id ? 'Edit' : 'Submit')
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

	formatDate(d) {
		return (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear();
	}

	handleSelection(e, value) {
		let data = {};
		data[e.target.name] = value;
		this.setState(data);
	}

	renderDenyDialog() {

	}

	handleDeny() {
		let location = this.props.params['_job'];
		let index = this.props.jobs.findIndex((job) => job.link === location);
		let jobId = this.props.jobs[index]._id;
		let comment = (this.refs.denyComment ? this.refs.denyComment.getValue() : '');
		let data = {
			id: this.props.details._id,
			jobId: jobId,
			jwt: this.props.token.jwt,
			comment: comment
		}
		this.props.workorderAction('programs/put/deny', data, 'Programs');
	}

	getActionButtons() {
		let location = this.props.params['_job'];
		let index = this.props.jobs.findIndex((job) => job.link === location);
		let jobId = this.props.jobs[index]._id;
		let role = this.props.jobs[index].role;
		let { checked, reviewed, approved } = this.state;
		let { actionStyle } = this.state.styles;
		let data = {
			id: this.props.details._id,
			jobId: jobId,
			jwt: this.props.token.jwt
		}
		let disabled;
		let title = 'Deny Program';
		let content = [
			<center>
				<p>Please enter a reason which will be included in an email sent to the submitter.</p>
				<Formsy.Form
					ref='denyForm'
				>
					<FormsyText
						ref='denyComment'
						name='denyComment'
						floatingLabelText='Deny Reason'
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
				label='Deny'
				key='deny'
				hoverColor='#ef5350'
				onClick={this.handleDeny.bind()}
			/>,
		];

		if(!(role === 'submitter') && this.props.details._id) {
			if(role === 'hall_director'){
				disabled = (checked ? true : false);
			}
			if(role === 'reviewer') {
				disabled = (reviewed ? true : false);
			}
			if(role === 'approver') {
				disabled = (approved ? true : false);
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
						label='Deny'
						backgroundColor='#ef9a9a'
						hoverColor='#ef5350'
						onClick={this.props.openDialog.bind(this, title, content, actions)}
					/>
					<FlatButton
						style={actionStyle}
						label='Approve'
						backgroundColor='#C5E1A5'
						hoverColor='#9CCC65'
						disabled={disabled}
						onClick={this.props.workorderAction.bind(this, 'programs/put/approve', data, 'Programs')}
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

	submitForm(data) {
		alert(JSON.stringify(data, null, 4));
	}

	notifyFormError(data) {
		console.error('Form error:', data);
	}

	addJSONItem() {
		let items = this.state.items;
		items.push({ description: '', cost: '' });
		this.setState({ items });
	}

	removeJSONItem(index) {
		let itemsArray = this.refs.form.getModel().items;
		let newItems = [];
		delete itemsArray[index];
		itemsArray.map((item) => newItems.push({description: item.description, cost: item.cost}))
		this.setState({ items: newItems });
	}

	renderItem(item, i) {
		let { listStyle, listPaperStyle, centerStyle } = this.state.styles;
		return (
			<Paper style={listPaperStyle} key={i}>
				<Subheader>{'Item '+(i+1)}</Subheader>
				<div style={listStyle}>
					<FormsyText
						required
						name={'items['+i+'][description]'}
						hintText='Include name and quantity'
						floatingLabelText='Item Description'
						multiLine={true}
						style={{paddingLeft: '0em'}}
						value={item.description}
					/>
					<br />
					<FormsyText
						required
						name={'items['+i+'][cost]'}
						validation='isNumeric'
						validationError='Please use only numbers'
						hintText='Total item cost'
						floatingLabelText='Item cost'
						style={{paddingLeft: '0em'}}
						value={item.cost}
						disabled={(this.state.reviewed ? true : false)}
					/>
				</div>
				<FlatButton
					label='Remove'
					hoverColor={red500}
					disabled={(this.state.reviewed ? true : false)}
					onClick={this.removeJSONItem.bind(this, i)}
					style={centerStyle}
				/>
			</Paper>
		)
	}

	renderCostTotal() {
		if(this.refs.form){
			let itemsArray = this.refs.form.getModel().items;
			let total = 0;
			let { listStyle } = this.state.styles;
			if(itemsArray){
				itemsArray.map(function(item) {
					if(item.cost !== ''){
						total+=parseFloat(item.cost.replace(/[^0-9.]/g, ""), 10);
					}
				});
				if(total > 0){
					return (
						<div className='row'>
							<Subheader>Funding Type</Subheader>
							<FormsyRadioGroup
								required
								name='fundingType'
								valueSelected={this.state.fundingType}
								onChange={this.handleSelection} 
							>
								<FormsyRadio
									value='pcard'
									label='P-Card'
								/>
								<FormsyRadio
									value='hootloot'
									label='Hootloot'
								/>
							</FormsyRadioGroup>
							<FormsyText
								name='funding'
								required
								floatingLabelText='Total Cost'
								disabled={true}
								fullWidth={true}
								style={listStyle}
								value={'$' + total.toFixed(2)}
							/>
							{this.renderQuote(total)}
						</div>
					)
				}
			}
		}
	}

	renderQuote(total) {
		if(total >= 99) {
			return (
				<div>
					<br />
					If your total funding request for food purchases is over $99.00 you must request a competing quote from Chartwells.
					<Subheader>Chartwells Quote</Subheader>
					<FormsyRadioGroup
						required
						name='chartwellsQuote'
						valueSelected={this.state.chartwellsQuote}
						onChange={this.handleSelection} 
					>
						<FormsyRadio
							value='notRequired'
							label='Not Required'
						/>
						<FormsyRadio
							value='no'
							label='No'
						/>
						<FormsyRadio
							value='yes'
							label='Yes'
						/>
					</FormsyRadioGroup>
				</div>
			)
		}
	}

	addJSONStaff() {
		let staff = this.state.staff;
		staff.push({ name: '' });
		this.setState({ staff });
	}

	removeJSONStaff(index) {
		let staffArray = this.refs.form.getModel().staff;
		let newStaff = [];
		delete staffArray[index];
		staffArray.map((staff) => newStaff.push({name: staff.name}))
		this.setState({ staff: newStaff });
	}

	renderStaff(staff, i) {
		let { listStyle, listPaperStyle, centerStyle } = this.state.styles;
		return (
			<Paper style={listPaperStyle} key={i}>
				<Subheader>{'Staff '+(i+1)}</Subheader>
				<div style={listStyle}>
					<FormsyText
						name={'staff['+i+'][name]'}
						required
						hintText='Additional Staff'
						floatingLabelText='Staff Name'
						multiLine={true}
						style={{paddingLeft: '0em'}}
						value={staff.name}
					/>
				</div>
				<FlatButton
					label='Remove'
					hoverColor={red500}
					onClick={this.removeJSONStaff.bind(this, i)}
					style={centerStyle}
				/>
			</Paper>
		)
	}

	renderSearchId() {
		if(this.state.searchId){
			return (
				<FormsyText
					name='searchId'
					floatingLabelText='ID'
					value={this.state.searchId}
					disabled={true}
					fullWidth={true}
				/>
			)
		}
	}

	renderTypeContent() {
		let { centerStyle } = this.state.styles;
		if(this.refs.form) {
			let type = this.refs.form.getModel().type;
			if(type === 'Hall Council') {
				return (
					<div>
						<Divider />
						<Subheader>Hall Council Resolution</Subheader>
						<div style={centerStyle}>
							<FormsyDate
								name='councilDate'
								required
								fullWidth={true}
								firstDayOfWeek={0}
								formatDate={(date) => this.formatDate(date)}
								hintText='Date of council meeting'
								floatingLabelText='Date Of Meeting'
								value={this.state.councilDate}
							/>
							<FormsyText
								name='councilMotioned'
								required
								fullWidth={true}
								hintText='Who initiated this resolution'
								floatingLabelText='Motioned By'
								value={this.state.councilMotioned}
							/>
							<FormsyText
								name='councilSeconded'
								required
								fullWidth={true}
								hintText='Who seconded this resolution'
								floatingLabelText='Seconded By'
								value={this.state.councilSeconded}
							/>
							<FormsyText
								name='councilFavor'
								required
								fullWidth={true}
								validation='isNumeric'
								validationError='Please use only numbers'
								hintText='Number of members in Favor'
								floatingLabelText='Number In Favor'
								value={this.state.councilFavor}
							/>
							<FormsyText
								name='councilOpposed'
								required
								fullWidth={true}
								validation='isNumeric'
								validationError='Please use only numbers'
								hintText='Number of members opposed'
								floatingLabelText='Number Opposed'
								value={this.state.councilOpposed}
							/>
							<FormsyText
								name='councilAbstained'
								required
								fullWidth={true}
								validation='isNumeric'
								validationError='Please use only numbers'
								hintText='Number of members abstained'
								floatingLabelText='Number abstained'
								value={this.state.councilAbstained}
							/>
							<Subheader>Council Approval</Subheader>
							<FormsyRadioGroup
								required
								name='councilApproval'
								valueSelected={this.state.councilApproval}
								onChange={this.handleSelection} 
							>
								<FormsyRadio
									value='approved'
									label='Approved'
								/>
								<FormsyRadio
									value='denied'
									label='Denied'
								/>
							</FormsyRadioGroup>
						</div>
					</div>
				)
			}
		}
	}

	renderEvalContent() {
		if(!this.state.evaluated && this.state.performEval === false) {
			return (
				<FlatButton onClick={this.setState.bind(this, {performEval: true, label: 'Submit'})} label='Perform Evaluation'/>
			)
		}
		else {
			return (
				<div>
					<FormsyTime
						name='evalTime'
						fullWidth={true}
						hintText='When did the event end?'
						floatingLabelText='End Time'
						value={this.state.evalTime}
					/>
					<FormsyText
						name='evalAttendance'
						fullWidth={true}
						hintText='How many students attended?'
						floatingLabelText='Attendance'
						value={this.state.evalAttendance}
					/>
					<FormsyText
						name='evalCost'
						fullWidth={true}
						hintText='How much did you actually spend?'
						floatingLabelText='Actual Cost'
						value={this.state.evalCost}
					/>
					<Subheader>P-card and Reciepts Returned</Subheader>
					<FormsyRadioGroup
						name='evalCardReturn'
						valueSelected={this.state.evalCardReturn}
						onChange={this.handleSelection} 
					>
						<FormsyRadio
							value='no'
							label='No'
						/>
						<FormsyRadio
							value='yes'
							label='Yes'
						/>
					</FormsyRadioGroup>
					<FormsyText
						name='evalOutcomes'
						fullWidth={true}
						multiLine={true}
						hintText='What learning outcomes were achieved?'
						floatingLabelText='Achieved Outcomes'
						value={this.state.evalOutcomes}
					/>
					<FormsyText
						name='evalStrengths'
						fullWidth={true}
						multiLine={true}
						hintText='What were the programs strengths?'
						floatingLabelText='Strengths'
						value={this.state.evalStrengths}
					/>
					<FormsyText
						name='evalWeaknesses'
						fullWidth={true}
						multiLine={true}
						hintText='What were the programs weaknesses?'
						floatingLabelText='Weaknesses'
						value={this.state.evalWeaknesses}
					/>
					<FormsyText
						name='evalSuggestions'
						fullWidth={true}
						multiLine={true}
						hintText='What could improve this program for if done again?'
						floatingLabelText='Suggestions for Improvement'
						value={this.state.evalSuggestions}
					/>
					<FormsyText
						name='evalOther'
						fullWidth={true}
						multiLine={true}
						hintText='Other Comments or Concerns?'
						floatingLabelText='Other Comments or Concerns (0ptional)'
						value={this.state.evalOther}
					/>
				</div>
			)
		}
	}

	renderEvaluation () {
		let { centerStyle } = this.state.styles;
		if(this.state.evaluated || this.state.approved) {
			return (
				<div>
					<Divider />
					<Subheader>Program Evaluation</Subheader>
					<div style={centerStyle}>
						{this.renderEvalContent()}
					</div>
				</div>
			)
		}
	}

	renderAddComment() {
		let { listStyle, listPaperStyle, centerStyle } = this.state.styles;
		return (
			<Paper style={listPaperStyle}>
				<Formsy.Form
					ref='form'
					onValid={this.enableButton}
					onInvalid={this.disableButton}
					//onValidSubmit={this.submitComment.bind(this)}
					onValidSubmit={this.submitForm}
					onInvalidSubmit={this.notifyFormError}
				>
					<FormsyText
						name={'message'}
						required
						floatingLabelText='Add Comment'
						multiLine={true}
						// style={listStyle}
					/>
				</Formsy.Form>
			</Paper>
		)
	}

	render() {
		let { centerStyle } = this.state.styles;
		return (
			<div>
				<br />
				<Divider />
				<Subheader>Program Tracker</Subheader>
				<div style={centerStyle}>
					<TrackProgram workOrder={this.props.details} size={screen.width}/>
				</div>
				<Formsy.Form
					ref='form'
					onValid={this.enableButton}
					onInvalid={this.disableButton}
					onValidSubmit={this.props.onSubmit.bind(this)}
					// onValidSubmit={this.submitForm}
					onInvalidSubmit={this.notifyFormError}
				>
					<Divider />
					<Subheader style={ {paddingBottom: '0.25em'} }>Basic Information</Subheader>
					<div style={centerStyle}>
						{this.renderSearchId()}
						<FormsyText
							name='title'
							required
							fullWidth={true}
							multiLine={true}
							hintText='Descriptive program title?'
							floatingLabelText='Title'
							value={this.state.title}
						/>
						<FormsyDate
							name='date'
							required
							fullWidth={true}
							firstDayOfWeek={0}
							minDate={new Date()}
							formatDate={(date) => this.formatDate(date)}
							hintText='Program date?'
							floatingLabelText='Date'
							value={this.state.date}
						/>
						<FormsyTime
							name='time'
							required
							fullWidth={true}
							hintText='Program time?'
							floatingLabelText='Time'
							value={this.state.time}
						/>
						<FormsySelect
							name='type'
							required
							fullWidth={true}
							floatingLabelText='Type'
							value={this.state.type}
						>
							<MenuItem value='Social' primaryText='Social' />
							<MenuItem value='All Hall' primaryText='All Hall' />
							<MenuItem value='Academic Professional Success' primaryText='Academic Professional Success' />
							<MenuItem value='Civic Engagement' primaryText='Civic Engagement' />
							<MenuItem value='Hall Council' primaryText='Hall Council' />
							<MenuItem value='RHA' primaryText='RHA' />
							<MenuItem value='Life Skills' primaryText='Life Skills' />
							<MenuItem value='LLC Honors' primaryText='LLC Honors' />
							<MenuItem value='LLC International' primaryText='LLC International' />
							<MenuItem value='LLC Sustainability' primaryText='LLC Sustainability' />
							<MenuItem value='LLC Transfer' primaryText='LLC Transfer' />
							<MenuItem value='LLC First Generation' primaryText='LLC First Generation' />
							<MenuItem value='LLC Health Professions' primaryText='LLC Health Professions' />
							<MenuItem value='Social Justice' primaryText='Social Justice' />
							<MenuItem value='Weekend' primaryText='Weekend' />
							<MenuItem value='Funding Only' primaryText='Funding Only' />
							<MenuItem value='Other' primaryText='Other' />
						</FormsySelect>
					</div>

					{this.renderTypeContent()}

					<Divider />
					<Subheader>Program Details</Subheader>
					<div style={centerStyle}>
						<FormsyText
							name='location'
							required
							fullWidth={true}
							multiLine={true}
							hintText='Program location?'
							floatingLabelText='Location'
							value={this.state.location}
						/>
						<Subheader>Travel Authorization Form Completed</Subheader>
						<FormsyRadioGroup
							required
							name='travelAuthorization'
							valueSelected={this.state.travelAuthorization}
							onChange={this.handleSelection} 
						>
							<FormsyRadio
								value='onCampus'
								label='Staying on campus'
							/>
							<FormsyRadio
								value='no'
								label='No'
							/>
							<FormsyRadio
								value='yes'
								label='Yes'
							/>
						</FormsyRadioGroup>
						<FormsyText
							name='outcomes'
							required
							fullWidth={true}
							multiLine={true}
							hintText='Expected learning outcomes?'
							floatingLabelText='Outcomes'
							value={this.state.outcomes}
						/>
						<FormsyText
							name='description'
							required
							fullWidth={true}
							multiLine={true}
							hintText='Program description?'
							floatingLabelText='Description'
							value={this.state.description}
						/>
						<FormsyText
							name='department'
							fullWidth={true}
							multiLine={true}
							hintText='Collaborating Department?'
							floatingLabelText='Department (optional)'
							value={this.state.department}
						/>
					</div>

					<Divider />
					<Subheader>Funding</Subheader>
					<div style={centerStyle}>
						{this.state.items.map(this.renderItem)}
						<FlatButton
							icon={<FontIcon className='material-icons'>{'add'}</FontIcon>}
							type='button'
							label='Add Item'
							onClick={this.addJSONItem.bind(this)}
							disabled={(this.state.reviewed ? true : false)}
						/>
						{this.renderCostTotal()}
					</div>

					<Divider />
					<Subheader>Staff</Subheader>
					<div style={centerStyle}>
						{this.state.staff.map(this.renderStaff)}
						<FlatButton
							icon={<FontIcon className='material-icons'>{'add'}</FontIcon>}
							type='button'
							label='Add Staff'
							onClick={this.addJSONStaff.bind(this)}
						/>
					</div>

					{this.renderEvaluation()}

					{/*
					Add Comment Box
					<Divider />
					<Subheader>Comments</Subheader>
					<div style={centerStyle}>
						{this.renderAddComment()}
					</div>
					*/}

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

export default FormWrapper(Program);