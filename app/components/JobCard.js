import React from 'react';
import { Link } from 'react-router';
import Card from 'material-ui/Card';
import CardActions from 'material-ui/Card/CardActions';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import CardTitle from 'material-ui/Card/CardTitle';
import CardText from 'material-ui/Card/CardText';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
	

const JobCard = React.createClass({
	renderAction (action, i) {
		return (
			<FlatButton
				key={i}
				label={action.title}
				icon={<FontIcon className="material-icons">{action.icon}</FontIcon>}
				onClick={this.props.performRouteAndUpdate.bind(null, "/job/"+this.props.link+'/'+action.route, this.props.endpoint)}
			/>
		)
	},

	render () {
		const color = {
			background: this.props.color,
			height: this.props.height+'em'
		}

		return (
			<div>
				<Card zDepth={2}>
					<a onClick={this.props.performRouteAndUpdate.bind(null, "/job/"+this.props.link, this.props.endpoint)}>
						<Paper zDepth={1}>
							<CardTitle title={this.props.title} subtitle={this.props.subTitle} style={color} titleColor={this.props.titleColor}/>
							<div style={color} />
						</Paper>
					</a>
					<CardActions>
						{this.props.actions.map(this.renderAction)}
					</CardActions>
				</Card>
			</div>
		)
	}
});

export default JobCard;