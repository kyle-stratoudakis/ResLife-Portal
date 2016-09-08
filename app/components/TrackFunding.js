import React from 'react'
import { Stepper, Step, StepLabel, StepButton, StepContent } from 'material-ui'
import { ActionAssignment, ActionAssignmentTurnedIn, ActionAssignmentInd } from 'material-ui/svg-icons';
import { grey500, lightGreen500 } from 'material-ui/styles/colors';

const TrackFunding = React.createClass({
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

		if(workorder.checked){
			steps.push(
				<Step>
					<StepLabel icon={(workorder.checked ? approved : pending)}>
						RHA
						<br />
						{workorder.checked.name}
						<br />
						{workorder.checkedDate ? this.getDate(workorder.checkedDate) : ''}
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
						{this.getDate(workorder.reviewedDate)}
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
						{workorder.approvedDate ? this.getDate(workorder.approvedDate) : ''}
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

export default TrackFunding;