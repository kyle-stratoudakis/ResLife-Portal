import React, { Component } from 'react';
import { Link } from 'react-router';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper'
import CardActions from 'material-ui/Card/CardActions'
import CardHeader from 'material-ui/Card/CardHeader'
import CardMedia from 'material-ui/Card/CardMedia'
import CardText from 'material-ui/Card/CardText'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Table from 'material-ui/Table'
import TableHeader from 'material-ui/Table/TableHeader'
import TableRow from 'material-ui/Table/TableRow'
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn'
import { ActionAssignment, ActionAssignmentTurnedIn, ActionAssignmentInd } from 'material-ui/svg-icons'; 
import { green200, red200, amber200, deepPurple200 } from 'material-ui/styles/colors';
import getDate from '../../utils/getDate'; 


class ContentRow extends Component {
	constructor(props) {
		super(props)

		this.state = {limit: 20};

		this.renderAction = this.renderAction.bind(this);
		this.renderAvatar = this.renderAvatar.bind(this);
		this.renderDescription = this.renderDescription.bind(this);
		this.renderRow = this.renderRow.bind(this);
	}

	renderAction (action, id, i) {
		let disabled = (id === 'x' ? true : false);
		if(action.type == 'route') {
			return (
				<FlatButton
					key={i}
					label={action.title}
					backgroundColor={action.color}
					hoverColor={action.hover_color}
					onClick={this.props.performRoute.bind(null, '/job/'+this.props.location+'/'+action.route+id)}
					disabled={disabled}
				/>
			)
		}
		else if(action.type === 'modify') {
			let endpoint = action.endpoint[0].route;
			let data = {
				jwt: this.props.jwt,
				jobId: this.props.jobId,
				id
			};
			let update = this.props.location +'/'+ this.props.parentEndpoint +"&jwt="+ this.props.jwt +"&job="+ this.props.jobId;

			return (
				<FlatButton
					key={i}
					label={action.title}
					backgroundColor={action.color}
					hoverColor={action.hover_color}
					onClick={this.props.modifyAction.bind(null, endpoint, data, update)}
					disabled={disabled}
				/>
			)
		}
	}

	renderAvatar(checked, reviewed, approved, evaluated) {
		let color;
		let icon = <ActionAssignment />
		if(evaluated) {
			color = deepPurple200;
		}
		else if(approved) {
			color = green200;
		}
		else if(checked && reviewed) {
			color = amber200;
		}
		else if(checked || reviewed) {
			color = red200;
		}
		return (
			<Avatar
				icon={icon}
				backgroundColor={color}
			/>
		)
	  }

	renderDescription (description, _id) {
		if(description && description.length > 120) {
			return (
				<div>
					{description.substring(0, 120)}
					<Link to={'/job/'+this.props.location+'/View/'+this.props.location+'/'+_id}>...</Link>
				</div>
			)	
		}
		else {
			return description
		}
	}

	renderRow (row, i) {
		let{ checked, reviewed, approved, evaluated, submittedDate } = row;
		let { searchId, title } = row; 
		return (
			<div className="container row" key={i}>
				<div className="col-sm-4">
					<CardHeader 
						avatar={this.renderAvatar(checked, reviewed, approved, evaluated)} 
						title={(searchId ? searchId+' - '+title : title)} 
						subtitle={row.name}
					/>
				</div>
				<div className="col-sm-4">
					<CardText>
						{this.renderDescription(row.description, row._id)}
					</CardText>
				</div>
				<div className="col-sm-2">
					<CardText>
						{getDate(new Date(submittedDate))}
					</CardText>
				</div>
				<div className="col-sm-2">
					<CardActions>
						{this.props.actions.map((action, i) => this.renderAction(action, row._id, i))}
					</CardActions>
				</div>
				<Divider />
			</div>
		)
	}

	limitRender() {
		let workorders = this.props.data.slice(0, this.state.limit);
		return (
			workorders.map(this.renderRow)
		)
	}

	renderLoadMore() {
		if(this.props.data.length > this.state.limit) {
			return(
				<div>
					<br />
					<Divider />
					<center>
						<br />
						Showing {this.state.limit} of {this.props.data.length}
						<br />
						<FlatButton label='Load More' onClick={this.handleLoadMore.bind(this)} />
						<br />
					</center>
				</div>
			)
		}
	}

	handleLoadMore() {
		this.setState({limit: this.state.limit += 20})
	}

	render () {
		return (
			<div ref='table'>
				<Table>
					<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
						<TableRow>
							<TableHeaderColumn className="col-sm-4">Title</TableHeaderColumn>
							<TableHeaderColumn className="col-sm-4">Description</TableHeaderColumn>
							<TableHeaderColumn className="col-sm-2">Date Submitted</TableHeaderColumn>
							<TableHeaderColumn className="col-sm-2">Actions</TableHeaderColumn>
							<Divider />
						</TableRow>
					</TableHeader>
				</Table>
				<div>
					{this.limitRender()}
					{this.renderLoadMore()}
				</div>
			</div>
		)
	}
}

export default ContentRow;