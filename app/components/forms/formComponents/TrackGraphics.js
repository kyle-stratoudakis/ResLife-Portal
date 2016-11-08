import React from 'react'
import { Stepper, Step, StepLabel, StepButton, StepContent } from 'material-ui'
import { ActionAssignment, ActionAssignmentTurnedIn, ActionAssignmentInd } from 'material-ui/svg-icons';
import { grey500, lightGreen500 } from 'material-ui/styles/colors';
import getDate from '../../../../utils/getDate';

const TrackGraphics = React.createClass({
	/*
		So, this should have the following statuses: new, assigned, completed.
		User obviously sumbits and the assigned SWK graphic designer obviously completes,
		
		but the question is do we want someone to assign these tasks? 
		
		or should SWK's be able to pick up requests on their own and 
		assign them to themselves?

		However we decide, we would need to change the tracking for this job accordingly.
	 */

	renderSteps() {
		let workorder = this.props.workOrder;
		const approved = <ActionAssignmentTurnedIn color={lightGreen500} />;
		const pending = <ActionAssignmentInd color={grey500} />;
		let steps = [];
		
		if(workorder._id) {
			steps.push(
				<Step>
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
				<Step>
					<StepLabel icon={pending}>
						Submission
					</StepLabel>
				</Step>
			);
		}

		if(workorder.checked){
			steps.push(
				<Step>
					<StepLabel icon={(workorder.checked ? approved : pending)}>
						Hall Director
						<br />
						{workorder.checked.name}
						<br />
						{workorder.checkedDate ? getDate(workorder.checkedDate) : ''}
					</StepLabel>
				</Step>
			);
		}
		else {
			steps.push(
				<Step>
					<StepLabel icon={pending}>
						Hall Director
					</StepLabel>
				</Step>
			);
		}

		if(workorder.reviewed){
			steps.push(
				<Step>
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
				<Step>
					<StepLabel icon={pending}>
						Reviewed
					</StepLabel>
				</Step>
			);
		}

		if(workorder.approved){
			steps.push(
				<Step>
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
				<Step>
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

export default TrackGraphics;