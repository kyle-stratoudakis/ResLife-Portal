import React from 'react'
import { Stepper, Step, StepLabel, StepButton, StepContent } from 'material-ui'
import { ActionAssignment, ActionAssignmentTurnedIn, ActionAssignmentInd } from 'material-ui/svg-icons';
import { grey500, lightGreen500 } from 'material-ui/styles/colors';
import getDate from '../../../../utils/getDate';

const TrackFunding = React.createClass({
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
						{workorder.submittedDate ? getDate(workorder.submittedDate) : ''}
					</StepLabel>
				</Step>
			);
		}
		else {
			steps.push(
				<Step key={1}>
					<StepLabel icon={pending}>
						Submission
					</StepLabel>
				</Step>
			);
		}

		if(workorder.needsCheck === true) {
			steps.push(
				<Step key={2}>
					<StepLabel icon={pending}>
						RHA
					</StepLabel>
				</Step>
			);
		}
		else if(workorder.checked) {
			steps.push(
				<Step key={2}>
					<StepLabel icon={approved}>
						RHA
						<br />
						{workorder.checked.name}
						<br />
						{workorder.checkedDate ? getDate(workorder.checkedDate) : ''}
					</StepLabel>
				</Step>
			);
		}

		if(workorder.reviewed) {
			steps.push(
				<Step key={3}>
					<StepLabel icon={approved}>
						Reviewed
						<br />
						{workorder.reviewed.name}
						<br />
						{getDate(workorder.reviewedDate)}
					</StepLabel>
				</Step>
			);
		}
		else {
			steps.push(
				<Step key={3}>
					<StepLabel icon={pending}>
						Reviewed
					</StepLabel>
				</Step>
			);
		}

		if(workorder.approved) {
			steps.push(
				<Step key={4}>
					<StepLabel icon={approved}>
						Approved
						<br />
						{workorder.approved.name}
						<br />
						{workorder.approvedDate ? getDate(workorder.approvedDate) : ''}
					</StepLabel>
				</Step>
			);
		}
		else {
			steps.push(
				<Step key={4}>
					<StepLabel icon={pending}>
						Approved
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

export default TrackFunding;