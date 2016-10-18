import React from 'react'
import { Stepper, Step, StepLabel, StepButton, StepContent } from 'material-ui'
import { ActionAssignment, ActionAssignmentTurnedIn, ActionAssignmentInd } from 'material-ui/svg-icons';
import { grey500, lightGreen500 } from 'material-ui/styles/colors';

const TrackTech = React.createClass({
	getDate(date) {
		let d = new Date(date)
		let formattted = (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear();
		return formattted;
	},

	renderSteps() {
		let workorder = this.props.workOrder;
		const approved = <ActionAssignmentTurnedIn color={lightGreen500} />;
		const pending = <ActionAssignmentInd color={grey500} />;
		let steps = [];
		
		if(workorder._id) {
			steps.push(
				<Step key={1}>
					<StepLabel icon={(workorder._id ? <ActionAssignment color={lightGreen500} /> : pending)}>
						Submission
						<br />
						{workorder.user.name}
						<br />
						{workorder.date ? this.getDate(workorder.date) : ''}
					</StepLabel>
				</Step>
			);
		}
		else {
			steps.push(
				<Step key={2}>
					<StepLabel icon={pending}>
						Submission
					</StepLabel>
				</Step>
			);
		}

		if(workorder.closed){
			steps.push(
				<Step key={3}>
					<StepLabel icon={approved}>
						Closed
						<br />
						{workorder.closed.name}
						<br />
						{this.getDate(workorder.closedDate)}
					</StepLabel>
				</Step>
			);
		}
		else {
			steps.push(
				<Step key={4}>
					<StepLabel icon={pending}>
						Closed
					</StepLabel>
				</Step>
			);
		}
		return steps
	},

	render () {
		let linear = (this.props.size > 500 ? true : false);
		let orientation = (this.props.size > 500 ? 'horizontal' : 'vertical');
		return(
			<div style={ {'paddingRight': '1em' } }>
				<Stepper linear={linear} orientation={orientation}>
					{this.renderSteps()}
				</Stepper>
			</div>
		)
	}
});

export default TrackTech;