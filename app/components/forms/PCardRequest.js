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
import { red500 } from 'material-ui/styles/colors';
import FormsyText from './formComponents/FormsyText';
import FormsyDate from './formComponents/FormsyDate';
import FormsyTime from './formComponents/FormsyTime';
import TrackFunding from './formComponents/TrackFunding' ;
import CommentSection from './formComponents/CommentSection';
import formatDate from '../../../utils/formatDate';
import {
	FormsyRadioGroup,
	FormsyRadio,
	FormsySelect
} from 'formsy-material-ui/lib';

class pCardRequest extends Component{
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
		this.renderQuote = this.renderQuote.bind(this);
		this.handleToggle = this.handleToggle.bind(this);
		this.handleComment = this.handleComment.bind(this);

		this.state = {
			canSubmit: false,
			searchId: null,
			title: '',
			type: '',
			location: '',
			outcomes:'',
			description: '',
			label: 'Submit',
			cardType: 'pcard',
			department: '',
			items: [],
			staff: [],
			comments: [],
			date: {},
			time: {},
			checked: null,
			reviewed: null,
			approved: null,
			travelAuthorization: 'onCampus',
			chartwellsQuote: '',
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
				searchId: wo.searchId || null,
				title: wo.title || '',
				date: (wo.date ? new Date(wo.date) : {}),
				time: (wo.time ? new Date(wo.time) : {}),
				type: wo.type || '',
				location: wo.location || '',
				outcomes: wo.outcomes || '',
				description: wo.description || '',
				department: wo.department || '',
				cardType: wo.cardType || '',
				items: (wo.items ? JSON.parse(wo.items) : []),
				staff: (wo.staff ? JSON.parse(wo.staff) : []),
				comments: wo.comments || [],
				checked: wo.checked,
				reviewed: wo.reviewed,
				approved: wo.approved,
				travelAuthorization: wo.travelAuthorization || 'onCampus',
				chartwellsQuote: wo.chartwellsQuote || '',
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

	getActionButtons() {
		let location = this.props.params['_job'];
		let index = this.props.jobs.findIndex((job) => job.link === location);
		if(index === -1) return //If user does not have job, no action are returned
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
		if(!(role === 'submitter') && this.props.details._id) {
			if(role === 'reviewer') {
				disabled = (reviewed ? true : false);
			}
			else if(role === 'approver') {
				disabled = (approved ? true : false);
			}
			else if(role === 'checker') {
				disabled = (checked ? true : false);
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
						onClick={this.props.workorderAction.bind(this, 'Funding/put/return', data, 'Funding')}
					/>
					<FlatButton
						style={actionStyle}
						label='Approve'
						backgroundColor='#C5E1A5'
						hoverColor='#9CCC65'
						disabled={disabled}
						onClick={this.props.workorderAction.bind(this, 'Funding/put/approve', data, 'Funding')}
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
						fullWidth={true}
						multiLine={true}
						style={{paddingLeft: '0em'}}
						value={item.description}
					/>
					<br />
					<FormsyText
						required
						fullWidth={true}
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
				<center>
					<FlatButton
						label='Remove'
						hoverColor={red500}
						disabled={(this.state.reviewed ? true : false)}
						onClick={this.removeJSONItem.bind(this, i)}
						style={centerStyle}
					/>
				</center>
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
						onChange={this.handleToggle} 
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
						required
						name={'staff['+i+'][name]'}
						hintText='Additional Staff'
						floatingLabelText='Staff Name'
						fullWidth={true}
						multiLine={true}
						style={{paddingLeft: '0em'}}
						value={staff.name}
					/>
				</div>
				<center>
					<FlatButton
						label='Remove'
						hoverColor={red500}
						onClick={this.removeJSONStaff.bind(this, i)}
						style={centerStyle}
					/>
				</center>
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

	handleToggle(e, value) {
		let data = {};
		data[e.target.name] = value;
		this.setState(data);
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
		if(comment > '') this.props.comment(data, 'Funding');
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
					<Subheader>Approval Tracker</Subheader>
					<div style={centerStyle}>
						<TrackFunding workOrder={this.props.details} size={screen.width}/>
					</div>
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
							formatDate={(date) => formatDate(date)}
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
						<Subheader>Card Type</Subheader>
						<FormsyRadioGroup
							required
							name='cardType'
							valueSelected={this.state.cardType}
							onChange={this.handleToggle} 
						>
							<FormsyRadio
								value='farnham'
								label='Farnham Program Space'
							/>
							<FormsyRadio
								value='conferences'
								label='ResLife Conferences'
							/>
							<FormsyRadio
								value='general'
								label='ResLife General'
							/>
							<FormsyRadio
								value='programming'
								label='ResLife Programming'
							/>
							<FormsyRadio
								value='rha'
								label='Residence Hall Association'
							/>
						</FormsyRadioGroup>
					</div>

					<Divider />
					<Subheader>Request Details</Subheader>
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
							onChange={this.handleToggle} 
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
							disabled={(this.state.checked || this.state.reviewed ? true : false)}
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

					<CommentSection 
						enable={(this.props.details._id ? true : false)}
						comments={this.state.comments} 
						handleComment={this.handleComment}
						userId={this.props.token.user._id}
						styles={this.state.styles}
					/>

					<Divider />
					<div style={centerStyle}>
						{this.getActionButtons()}
					</div>
				</Formsy.Form>
			</div>
		);
	}
}

export default FormWrapper(pCardRequest);