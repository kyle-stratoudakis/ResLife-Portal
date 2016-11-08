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
import TrackGraphics from '../TrackGraphics' ;

import {
	FormsyRadioGroup,
	FormsyRadio,
	FormsySelect
} from 'formsy-material-ui/lib';

	/*
		Tried to fight my way through this self-induced mess and ended up getting somewhere (not sure where though).
		
		The form still won't change even though I went into Portal.js and edited it. Not sure where I'm missing it
		but I can't get the little actoin card thingy to change eihter.
	 */

class Graphics extends Component {
	constructor(props) {
		super(props)

		this.disableButton = this.disableButton.bind(this);
		this.enableButton = this.enableButton.bind(this);
		this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
		this.getActionButtons = this.getActionButtons.bind(this);
		this.renderSearchId = this.renderSearchId.bind(this);
		this.formatDate = this.formatDate.bind(this);
		this.handleSelection = this.handleSelection.bind(this);
		this.renderDenyDialog = this.renderDenyDialog.bind(this);
		this.handleDeny = this.handleDeny.bind(this);
		this.renderUploads = this.renderUploads.bind(this);
		this.handleFileOnClick = this.handleFileOnClick.bind(this);
		this.handleFiles = this.handleFiles.bind(this);

		this.state = {
			canSubmit: false,
			searchId: null,
			title: '',
			location: '',
			phone: '',
			description: '',
			width: '',
			height: '',
			amount: '',
			file: [],
			label: 'Submit',
			department: '',
			measurements: 'Flyers (9"x11")',
			orientation: 'Portrait',
			date: {},
			completionDate: {},
			starttime: {},
			endtime: {},
			new: null,
			assigned: null,
			proof: null,
			completed: null,
			televisionRequest: 'No thank you.',
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
				},
				exampleImageInput: {
				    cursor: 'pointer',
				    position: 'absolute',
				    top: 0,
				    bottom: 0,
				    right: 0,
				    left: 0,
				    width: '100%',
				    opacity: 0,
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
				starttime: (wo.starttime ? new Date(wo.starttime) : {}),
				endtime: (wo.endtime ? new Date(wo.endtime) : {}),
				phone: wo.phone || '',
				location: wo.location || '',
				description: wo.description || '',
				department: wo.department || '',
				file: (wo.file ? JSON.parse(wo.file) : []),
				width: wo.width || '',
				height: wo.height || '',
				amount: wo.amount || '',
				measurements: wo.measurements || 'Flyers (9"x11")',
				orientation: wo.orientation || 'Portrait',
				completionDate: {},
				new: wo.new,
				assigned: wo.assigned,
				proof: wo.proof,
				completed: wo.completed,
				televisionRequest: wo.televisionRequest || 'No thank you.',
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
		this.props.workorderAction('Graphics/put/deny', data, 'Graphics');
	}

	getActionButtons() {
		let location = this.props.params['_job'];
		let index = this.props.jobs.findIndex((job) => job.link === location);
		let jobId = this.props.jobs[index]._id;
		let role = this.props.jobs[index].role;
		let { assigned, proof, completed } = this.state;
		let { actionStyle } = this.state.styles;
		let data = {
			id: this.props.details._id,
			jobId: jobId,
			jwt: this.props.token.jwt
		}
		let disabled;
		let title = 'Deny Graphics';
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
				disabled = (assigned ? true : false);
			}
			if(role === 'reviewer') {
				disabled = (completed ? true : false);
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
						onClick={this.props.workorderAction.bind(this, 'Graphics/put/approve', data, 'Graphics')}
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

	renderPosters(){
		if(this.state.measurements === 'poster') {
			return(
				<div>
				<FormsyText
					name='width'
					required
					hintText='How wide should this poster be (in inches)?'
					floatingLabelText='Width'
					fullWidth={true}
					value={this.state.width}
				/>
				<FormsyText
					name='height'
					required
					hintText='How tall should this poster be (in inches)?'
					floatingLabelText='Height'
					fullWidth={true}
					value={this.state.height}
				/>
				<FormsyText
					name='amount'
					required
					hintText='How many posters are needed?'
					floatingLabelText='Amount'
					fullWidth={true}
					value={this.state.amount}
				/>
				</div>
			)
		}
	}

	renderFlyers(){
		if(this.state.measurements === 'flyers') {
			return(
				<div>
				<Subheader style={ {paddingBottom: '0.5em'} }>Orientation</Subheader>
				<FormsyRadioGroup 
							required
							name='orientation'
							valueSelected={this.state.orientation}
							onChange={this.handleSelection} 
						>
							<FormsyRadio
								value='portrait'
								label='Portrait'
							/>
							<FormsyRadio
								value='landscape'
								label='Landscape'
							/>

				</FormsyRadioGroup>

				<FormsyText
					name='amount'
					required
					hintText='How many posters are needed?'
					floatingLabelText='Amount'
					fullWidth={true}
					value={this.state.amount}
				/>
				</div>
			)
		}
	}

	addJSONFile() {
		let file = this.state.file;
		file.push({ name: '' });
		this.setState({ file });
	}

	removeJSONFile(index) {
		let fileArray = this.refs.form.getModel().file;
		console.log(fileArray);
		let newFile = [];
		delete fileArray[index];
		fileArray.map((file) => newFile.push({name: file.name}))
		this.setState({ file: newFile });
	}

	handleFileOnClick() {
		let input = this.refs.input;

		

		if (document.createEvent) {
			var event = document.createEvent('MouseEvents');
			event.initEvent('click', true, true);
			input.dispatchEvent(event);
		}
		else {
			input.click();
		}

	}

	handleFiles(files) {
  		console.log(this.refs.input.files[0].name);

  		this.refs.hedgewig.setValue(this.refs.input.files[0].name);

	}

	//<input type="file" id="fileInput" style="position: fixed; top: -100em" />

	renderUploads(file, i) {
		let { listStyle, listPaperStyle, centerStyle, exampleImageInput } = this.state.styles;
		return (
			<Paper style={listPaperStyle} key={i}>
				<Subheader>{'File '+(i+1)}</Subheader>
				<div style={listStyle}>
					<FormsyText
						name={'file['+i+'][filename]'}
						required
						floatingLabelText='File Name'
						multiLine={true}
						style={{paddingLeft: '0em'}}
						ref="hedgewig"
						onClick={this.handleFileOnClick.bind(this)}
						value={file.value}
					/>

					<input type='file' style={exampleImageInput} onChange={this.handleFiles.bind(this)} hidden ref='input' />
					{/*onChange={this.handleFiles.bind(this)}*/}

				</div>
				<FlatButton
					label='Remove'
					hoverColor={red500}
					onClick={this.removeJSONFile.bind(this, i)}
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

	render() {
		let { centerStyle } = this.state.styles;
		return (
			<div>
				<br />
				<Divider />
				<Subheader>Graphics Tracker</Subheader>
				<div style={centerStyle}>
					<TrackGraphics workOrder={this.props.details} size={screen.width}/>
				</div>
				<Formsy.Form
					ref='form'
					onValid={this.enableButton}
					onInvalid={this.disableButton}
					//onValidSubmit={this.props.onSubmit.bind(this)}
					onValidSubmit={this.submitForm}
					onInvalidSubmit={this.notifyFormError}
				>
					<Divider />
					<Subheader style={ {paddingBottom: '0.25em'} }>Basic Information</Subheader>
					<div style={centerStyle}>
						{this.renderSearchId()}
						<FormsyText
							name='title'
							//required
							fullWidth={true}
							multiLine={true}
							hintText='Descriptive Graphics title?'
							floatingLabelText='Title'
							value={this.state.title}
						/>
						<FormsyDate
							name='completionDate'
							//required
							fullWidth={true}
							firstDayOfWeek={0}
							minDate={new Date()}
							formatDate={(date) => this.formatDate(date)}
							hintText='What date would you like the graphic to be completed by?'
							floatingLabelText='Requested Completion Date'
							value={this.state.date}
						/>
						<FormsyText
							name='phone'
							//required
							fullWidth={true}
							hintText='Phone # for Contact'
							floatingLabelText='Phone'
							value={this.state.title}
						/>
					</div>

					<Divider />
					<Subheader>Graphics Details</Subheader>
					<div style={centerStyle}>
						<FormsyDate
							name='date'
							//required
							fullWidth={true}
							firstDayOfWeek={0}
							minDate={new Date()}
							formatDate={(date) => this.formatDate(date)}
							hintText='When is the event?'
							floatingLabelText='Date'
							value={this.state.date}
						/>
						<FormsyTime
							name='startTime'
							//required
							fullWidth={true}
							hintText='Start time for the event?'
							floatingLabelText='Start Time'
							value={this.state.starttime}
						/>
						<FormsyTime
							name='endTime'
							//required
							fullWidth={true}
							hintText='End time for the event?'
							floatingLabelText='End Time'
							value={this.state.endtime}
						/>
						<FormsyText
							name='location'
							//required
							fullWidth={true}
							multiLine={true}
							hintText='Where is the event taking place?'
							floatingLabelText='Event Location'
							value={this.state.location}
						/>

						<Subheader style={ {paddingBottom: '0.5em'} }>Television Request</Subheader>
						<FormsyRadioGroup
							//required
							name='televisionRequest'
							valueSelected={this.state.televisionRequest}
							onChange={this.handleSelection} 
						>
							<FormsyRadio
								value='yesMyHall'
								label='Yes, I would like the final product to be placed on the display TV in my residence hall.'
							/>
							<FormsyRadio
								value='yesAllHalls'
								label='Yes, I would like the final product to be placed on the display TVs in all residence halls.'
							/>
							<FormsyRadio
								value='No'
								label='No thank you.'
							/>
						</FormsyRadioGroup>

						<Subheader style={ {paddingBottom: '0.5em'} }>Type, Size, and Quantity</Subheader>
						<FormsyRadioGroup
							//required
							name='measurements'
							valueSelected={this.state.measurements}
							onChange={this.handleSelection} 
						>
							<FormsyRadio
								value='poster'
								label='Posters'
							/>
							<FormsyRadio
								value='flyers'
								label='Flyers (9"x11")'
							/>

						</FormsyRadioGroup>

						{this.renderPosters()}
						{this.renderFlyers()}
						
						<FormsyText
							name='description'
							//required
							fullWidth={true}
							multiLine={true}
							hintText='Describe how you would like the graphic to look.'
							floatingLabelText='Description of Request'
							value={this.state.description}
						/>
					</div>

					{/*
					Add Comment Box
					<Divider />
					<Subheader>Comments</Subheader>
					<div style={centerStyle}>
						{this.renderAddComment()}
					</div>
					*/}

					<Divider />
					<Subheader>File Upload</Subheader>
					<div style={centerStyle} >

					{this.state.file.map(this.renderUploads)}

						<FlatButton
						      label="Upload"
						      icon={<FontIcon className="material-icons">file_upload </FontIcon>}
						      onClick={this.addJSONFile.bind(this)}>
						</FlatButton>

					</div>

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

export default FormWrapper(Graphics);