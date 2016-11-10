import React from 'react'
import { Stepper, Step, StepLabel, StepButton, StepContent } from 'material-ui'
import { ActionAssignment, ActionAssignmentTurnedIn, ActionAssignmentInd } from 'material-ui/svg-icons';
import { grey500, lightGreen500 } from 'material-ui/styles/colors';

const TrackGraphics = React.createClass({
	getDate(date) {
		let d = new Date(date)
		let formated = (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear();
		return formated;
	},

	/*
		So, this should have the following statuses: new, assigned, proofing, completed.
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
						{workorder.submittedDate ? this.getDate(workorder.submittedDate) : ''}
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

		if(workorder.assigned){
			steps.push(
				<Step>
					<StepLabel icon={(workorder.assigned ? approved : pending)}>
						Assigned
						<br />
						{workorder.assigned.name}
						<br />
						{workorder.assignedDate ? this.getDate(workorder.assignedDate) : ''}
					</StepLabel>
				</Step>
			);
		}
		else {
			steps.push(
				<Step>
					<StepLabel icon={pending}>
						Assigned
					</StepLabel>
				</Step>
			);
		}
		if(workorder.proof){
			steps.push(
				<Step>
					<StepLabel icon={(workorder.assigned ? approved : pending)}>
						Proof
						<br />
						{workorder.proof.name}
						<br />
						{workorder.proofDate ? this.getDate(workorder.proofDate) : ''}
					</StepLabel>
				</Step>
			);
		}
		else {
			steps.push(
				<Step>
					<StepLabel icon={pending}>
						Proof
					</StepLabel>
				</Step>
			);
		}
		if(workorder.completed){
			steps.push(
				<Step>
					<StepLabel icon={approved}>
						Completed
						<br />
						{workorder.completed.name}
						<br />
						{this.getDate(workorder.completedDate)}
					</StepLabel>
				</Step>
			);
		}
		else {
			steps.push(
				<Step>
					<StepLabel icon={pending}>
						Completed
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