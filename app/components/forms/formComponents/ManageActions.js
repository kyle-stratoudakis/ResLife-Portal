import React, { Component } from 'react';
import Formsy from 'formsy-react';
import FormsyText from './FormsyText';
import { FormsySelect } from 'formsy-material-ui/lib';
import MenuItem from 'material-ui/MenuItem';
import ManageEndpoints from './ManageEndpoints';

class ManageActions extends Component {
	constructor(props) {
		super(props);

		this.renderEndpoint = this.renderEndpoint.bind(this);
	}

	renderEndpoint() {
		if(this.props.endpoint) {
			<ManageEndpoints 
				styles={this.props.styles}
			/>
		}
	}

	addJSONAction() {
		let items = this.state.items;
		items.push({ description: '', cost: '' });
		this.setState({ items });
	}

	removeJSONAction(index) {
		let ActionsArray = this.refs.form.getModel().items;
		let newActions = [];
		delete ActionsArray[index];
		ActionsArray.map((action) => newActions.push({description: action.description, cost: action.cost}))
		this.setState({ items: newActions });
	}

	renderActions(action, i) {
		let { listStyle, listPaperStyle, centerStyle } = this.props.styles;
		return (
			<Paper style={listPaperStyle} key={i}>
				<Subheader>{'Item '+(i+1)}</Subheader>
				<div style={listStyle}>
				<FormsySelect
					required
					fullWidth={true}
					name='type'
					floatingLabelText='Type'
					value={action.type}
				>
					<MenuItem value='route' primaryText='Route' />
					<MenuItem value='modify' primaryText='Modify' />
					<MenuItem value='download' primaryText='Download' />
				</FormsySelect>	

				<FormsyText
					required
					fullWidth={true}
					name='title'
					hintText='Primary text on buttons'
					floatingLabelText='Title'
					value={action.title}
				/>

				<FormsyText
					required
					fullWidth={true}
					name='route'
					hintText='Route on the backend including GET parameters'
					floatingLabelText='Route'
					value={action.route}
				/>

				<FormsyText
					required
					fullWidth={true}
					name='note'
					hintText='Descriptive note to describe purpose of endpoint'
					floatingLabelText='Note'
					value={action.note}
				/>

				<FormsyText
					required
					fullWidth={true}
					name='icon'
					hintText='Name of font icon dispayed on buttons'
					floatingLabelText='icon'
					value={action.icon}
				/>

				{/*this.renderEndpoint()*/}
				</div>
				<center>
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

	render() {
		let { centerStyle } = this.props.styles;
		return (
			<div>
				<FormsySelect
					required
					fullWidth={true}
					name='type'
					floatingLabelText='Type'
				>
					<MenuItem value='route' primaryText='Route' />
					<MenuItem value='modify' primaryText='Modify' />
					<MenuItem value='download' primaryText='Download' />
				</FormsySelect>	

				<FormsyText
					required
					fullWidth={true}
					name='title'
					hintText='Primary text on buttons'
					floatingLabelText='Title'
				/>

				<FormsyText
					required
					fullWidth={true}
					name='route'
					hintText='Route on the backend including GET parameters'
					floatingLabelText='Route'
				/>

				<FormsyText
					required
					fullWidth={true}
					name='note'
					hintText='Descriptive note to describe purpose of endpoint'
					floatingLabelText='Note'
				/>

				<FormsyText
					required
					fullWidth={true}
					name='icon'
					hintText='Name of font icon dispayed on buttons'
					floatingLabelText='icon'
				/>

				{/*this.renderEndpoint()*/}
			</div>
		)
	}
}

export default ManageActions;