import React from 'react'
import { Stepper, Step, StepLabel, StepButton, StepContent } from 'material-ui'
import { ActionAssignment, ActionAssignmentTurnedIn, ActionAssignmentInd } from 'material-ui/svg-icons';
import { grey500, lightGreen500 } from 'material-ui/styles/colors';
import getDate from '../../../../utils/getDate';

const TrackProgram = React.createClass({

	renderSteps() {
		let workorder = this.props.workOrder;
		const approved = <ActionAssignmentTurnedIn color={lightGreen500} />;
		const pending = <ActionAssignmentInd color={grey500} />;
		let steps = [];
		
		if(workorder._id) {
			steps.push(
				<Step key={'user'}>
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
				<Step key={'user'}>
					<StepLabel icon={pending}>
						Submission
					</StepLabel>
				</Step>
			);
		}

		if(workorder.checked){
			steps.push(
				<Step key={'checked'}>
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
				<Step key={'checked'}>
					<StepLabel icon={pending}>
						Hall Director
					</StepLabel>
				</Step>
			);
		}

		if(workorder.reviewed){
			steps.push(
				<Step key={'reviewed'}>
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
				<Step key={'reviewed'}>
					<StepLabel icon={pending}>
						Reviewed
					</StepLabel>
				</Step>
			);
		}

		if(workorder.approved){
			steps.push(
				<Step key={'approved'}>
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
				<Step key={'approved'}>
					<StepLabel icon={pending}>
						Approved
					</StepLabel>
				</Step>
			);
		}

		if(workorder.evaluated){
			steps.push(
				<Step key={'evaluated'}>
					<StepLabel icon={<ActionAssignment color={lightGreen500} />}>
						Evaluated
						<br />
						{workorder.evaluated.name}
						<br />
						{workorder.evaluatedDate ? getDate(workorder.evaluatedDate) : ''}
					</StepLabel>
				</Step>
			);
		}

		return steps
	},

	render () {
		let linear = (this.props.size > 500 ? true : false);
		let orientation = (this.props.size > 500 ? 'horizontal' : 'vertical');
		let padding = 0;
		if(linear) {
			padding = 15;
			let {user, checked, reviewed, approved, evaluated} = this.props.workOrder;
			let status = [];
			status.push(user, checked, reviewed, approved, evaluated);
			status.map((item) => { if(item) padding = padding.toFixed(1) - 5 });
		}
		return(
			<div style={ {paddingRight: padding+'em', paddingLeft: padding+'em', paddingBottom: '1em'} }>
				<Stepper linear={linear} orientation={orientation}>
					{this.renderSteps()}
				</Stepper>
			</div>
		)
	}
});

export default TrackProgram;