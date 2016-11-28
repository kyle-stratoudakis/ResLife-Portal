import React, { Component } from 'react';
import Formsy from 'formsy-react';
import Paper from 'material-ui/Paper';
import FormsyText from './FormsyText';
import ManageActions from './ManageActions';
import {
	FormsyCheckbox,
	FormsyToggle
} from 'formsy-material-ui/lib';


class ManageEndpoints extends Component {
	constructor(props) {
		super(props);

		this.renderEndpoint = this.renderEndpoint.bind(this);
	}

	renderEndpoint(endpoint, i) {
		let { listStyle, listPaperStyle, centerStyle } = this.props.styles;
		return(
			<Paper style={listPaperStyle} key={i}>
				<div style={listStyle}>
					<FormsyText
						required
						fullWidth={true}
						name='endpoints[i].name'
						hintText='Label shown on Tab'
						floatingLabelText='Name'
						value={endpoint.name}
					/>
					<FormsyText
						required
						fullWidth={true}
						name='endpoints[i].note'
						hintText='Descriptive note of purpose for endpoint'
						floatingLabelText='Note'
						value={endpoint.note}
					/>
					<FormsyText
						required
						fullWidth={true}
						name='endpoints[i].route'
						hintText='Route on the backend including GET parameters'
						floatingLabelText='Route'
						value={endpoint.route}
					/>
					<br/>
					<FormsyToggle
						name="endpoints[i].viewAction"
						label="View Action"
						value={endpoint.viewAction}
					/>
					<FormsyToggle
						name="endpoints[i].approveAction"
						label="Approve Action"
						value={endpoint.approveAction}
					/>
					<FormsyToggle
						name="endpoints[i].returnAction"
						label="Return Action"
						value={endpoint.returnAction}
					/>
				</div>
			</Paper>
		)
	}

	render() {
		let { centerStyle } = this.props.styles;
		return (
			<div>
				{this.props.endpoints.map(this.renderEndpoint)}
			</div>
		)
	}
}

export default ManageEndpoints;