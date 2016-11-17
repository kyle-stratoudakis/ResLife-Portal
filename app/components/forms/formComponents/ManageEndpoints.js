import React, { Component } from 'react';
import Formsy from 'formsy-react';
import FormsyText from './FormsyText';
import ManageActions from './ManageActions';

class ManageEndpoints extends Component {
	constructor(props) {
		super(props);

		this.renderActions = this.renderActions.bind(this);
	}

	renderActions() {
		if(this.props.action) {
			<ManageActions 
				styles={this.props.styles}
			/>
		}
	}

	render() {
		let { centerStyle } = this.props.styles;
		return (
			<div>
				<div>
					<FormsyText
						required
						fullWidth={true}
						name='name'
						hintText='Label shown on Tab'
						floatingLabelText='Name'
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
						name='route'
						hintText='Route on the backend including GET parameters'
						floatingLabelText='Route'
					/>
				</div>
			</div>
		)
	}
}

export default ManageEndpoints;