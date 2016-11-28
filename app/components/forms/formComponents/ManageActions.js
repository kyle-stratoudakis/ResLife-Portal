import React, { Component } from 'react';
import Formsy from 'formsy-react';
import FormsyText from './FormsyText';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import { FormsySelect } from 'formsy-material-ui/lib';
import MenuItem from 'material-ui/MenuItem';

class ManageActions extends Component {
	constructor(props) {
		super(props);

		this.renderAction = this.renderAction.bind(this);
	}

	renderAction(action, i) {
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
				</div>
			</Paper>
		)
	}

	render() {
		let { centerStyle } = this.props.styles;
		return (
			<div>
				{this.props.actions.map(this.renderAction)}
			</div>
		)
	}
}

export default ManageActions;