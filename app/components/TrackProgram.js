import React from 'react'
import { Stepper, Step, StepLabel, StepButton, StepContent } from 'material-ui'
import { ActionAssignment, ActionAssignmentTurnedIn, ActionAssignmentInd } from 'material-ui/svg-icons';
import { grey500, lightGreen500 } from 'material-ui/styles/colors';

const TrackProgram = React.createClass({
	getDate(date) {
		let d = new Date(date)
		let formattted = (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear();
		return formattted;
	},

	renderStatus(status) {
		let workorder = this.props.workOrder;
		if(status === 'submission') {
			if(workorder._id){
				return (
					<div>
						Submission
						<br />
						{workorder.user.name}
						<br />
						{workorder.submittedDate ? this.getDate(workorder.submittedDate) : ''}
					</div>
				)
			}
			else {
				return 'Submission'
			}
		}
		else if(status === 'checked') {
			if(workorder.checked){
				return (
					<div>
						Hall Director
						<br />
						{workorder.checked.name}
						<br />
						{workorder.checkedDate ? this.getDate(workorder.checkedDate) : ''}
					</div>
				)
			}
			else {
				return 'Hall Director'
			}
		}
		else if(status === 'reviewed') {
			if(workorder.reviewed){
				return (
					<div>
						Reviewed
						<br />
						{workorder.reviewed.name}
						<br />
						{workorder.reviewedDate ? this.getDate(workorder.reviewedDate) : ''}
					</div>
				)
			}
			else {
				return 'Reviewed'
			}
		}
		else if(status === 'approved') {
			if(workorder.approved){
				return (
					<div>
						Approved
						<br />
						{workorder.approved.name}
						<br />
						{workorder.approvedDate ? this.getDate(workorder.approvedDate) : ''}
					</div>
				)
			}
			else {
				return 'Approved'
			}
		}
	},

	render () {
		const approved = <ActionAssignmentTurnedIn color={lightGreen500} />;
		const pending = <ActionAssignmentInd color={grey500} />;
		let workorder = this.props.workOrder;
		let linear = (this.props.size > 500 ? true : false);
		let orientation = (this.props.size > 500 ? 'horizontal' : 'vertical');
		return(
			<div style={ {'paddingRight': '1em' } }>
				<Stepper linear={linear} orientation={orientation}>
					<Step>
						<StepLabel icon={(workorder._id ? <ActionAssignment color={lightGreen500} /> : <ActionAssignment color={grey500} />)}>
							{this.renderStatus('submission')}
						</StepLabel>
					</Step>
					<Step>
						<StepLabel icon={(workorder.checked ? approved : pending)}>
							{this.renderStatus('checked')}
						</StepLabel>
					</Step>
					<Step>
						<StepLabel icon={(workorder.reviewed ? approved : pending)}>
							{this.renderStatus('reviewed')}
						</StepLabel>
					</Step>
					<Step>
						<StepLabel icon={(workorder.approved ? approved : pending)}>
							{this.renderStatus('approved')}
						</StepLabel>
					</Step>
				</Stepper>
			</div>
		)
	}
})

export default TrackProgram;