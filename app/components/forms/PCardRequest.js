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

class Program extends Component{
	constructor(props) {
		super(props)

		this.disableButton = this.disableButton.bind(this);
		this.enableButton = this.enableButton.bind(this);
		this.renderItem = this.renderItem.bind(this);
		this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
		this.renderCostTotal = this.renderCostTotal.bind(this);
		this.getActionButtons = this.getActionButtons.bind(this);
		this.renderSearchId = this.renderSearchId.bind(this);
		this.formatDate = this.formatDate.bind(this);
		this.handleToggle = this.handleToggle.bind(this);

		this.state = {
			canSubmit: false,
			searchId: null,
			title: '',
			description: '',
			label: 'Submit',
			cardType: '',
			items: [{description:'', cost:''}],
			checked: [],
			reviewed: null,
			approved: null,
			styles: {
				centerStyle: {
					marginBottom: '1em',
					marginLeft: 'auto', 
					marginRight: 'auto', 
					width: '50%'
				},
				listStyle: {
					// marginLeft: '1em',
					// marginRight: '1em',
					padding: '1em'
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
				cardType: wo.cardType || '',
				description: wo.description || '',
				items: (wo.items ? JSON.parse(wo.items) : [{description:'', cost:''}]),
				checked: wo.checked,
				reviewed: wo.reviewed,
				approved: wo.approved,
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
		let jobId = this.props.jobs[index]._id;
		let role = this.props.jobs[index].role;
		let { reviewed, approved } = this.state;
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
			else if(role === 'rha') {
				console.log(this.state.checked)
				disabled = false;
				for (var i = 0; i < this.state.checked.length; i++) {
					if(this.state.checked[i] === this.props.token.user._id) {
						console.log(this.state.checked[i], this.props.token.user._id, this.state.checked[i] === this.props.token.user._id)
						disabled = true;
						break;
					}
				}
			}
			console.log('exit ifs')
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
						disabled={!disabled}
						onClick={this.props.workorderAction.bind(this, 'funding/put/return', data, 'funding')}
					/> 
					<FlatButton
						style={actionStyle}
						label='Approve'
						backgroundColor='#C5E1A5'
						hoverColor='#9CCC65'
						disabled={disabled}
						onClick={this.props.workorderAction.bind(this, 'funding/put/approve', data, 'funding')}
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
		let count = this.state.items.length;
		let { listStyle, listPaperStyle, centerStyle } = this.state.styles;
		return (
			<Paper style={listPaperStyle} key={i}>
				<Subheader>{'Item '+(i+1)}</Subheader>
				<FormsyText
					name={'items['+i+'][description]'}
					required
					hintText='Include name and quantity'
					floatingLabelText='Item Description'
					// multiLine={true}
					style={listStyle}
					value={item.description}
				/>
				<br />
				<FormsyText
					name={'items['+i+'][cost]'}
					required
					validation='isNumeric'
					validationError='Please use only numbers'
					hintText='Total item cost'
					floatingLabelText='Item cost'
					style={listStyle}
					value={item.cost}
				/>
				<FlatButton
					label='Remove'
					hoverColor={red500}
					onClick={this.removeJSONItem.bind(this, i)}
					style={centerStyle}
					disabled={(count === 1 ? true : false)}
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
							<FormsyText
								name='funding'
								required
								floatingLabelText='Requested Funding'
								disabled={true}
								fullWidth={true}
								style={listStyle}
								value={'$' + total.toFixed(2)}
							/>
						</div>
					)
				}
			}
		}
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

	formatDate(d) {
		return (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear();
	}

	handleToggle(e, value) {
		let data = {};
		data[e.target.name] = value;
		this.setState(data);
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
					onInvalidSubmit={this.notifyFormError}
				>
					<Divider />
					<Subheader>Request Details</Subheader>
					<div style={centerStyle}>
						{this.renderSearchId()}
						<FormsyText
							name='title'
							required
							fullWidth={true}
							multiLine={true}
							hintText='Descriptive request title?'
							floatingLabelText='Title'
							value={this.state.title}
						/>
						<br />
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
						<FormsyText
							required
							name='description'
							fullWidth={true}
							multiLine={true}
							hintText='Why is this funding needed?'
							floatingLabelText='Description'
							value={this.state.description}
						/>
					</div>

					<Divider />
					<Subheader>Items</Subheader>
					<div style={centerStyle}>
						{this.state.items.map(this.renderItem)}
						<FlatButton
							icon={<FontIcon className='material-icons'>{'add'}</FontIcon>}
							type='button'
							label='Add Item'
							onClick={this.addJSONItem.bind(this)}
						/>
						{this.renderCostTotal()}
					</div>

					<Divider />

					<div style={centerStyle}>
						{this.getActionButtons()}
					</div>
				</Formsy.Form>
			</div>
		);
	}
}

export default FormWrapper(Program);