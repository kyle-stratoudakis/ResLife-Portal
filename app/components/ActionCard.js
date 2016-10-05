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

const ActionCard = React.createClass({
	handleClick() {
		if(this.props.type === 'route') {
			this.props.performRoute("/job/"+this.props.location+"/"+this.props.route);
		}
		else if(this.props.type === 'download') {
			this.props.downloadLink(this.props.route, this.props.jwt, this.props.jobId);
		}
	},

	render () {
		const color = {
			background: this.props.color,
			height: this.props.height+'em'
		}

		const style = {
			margin: '1em'
		}

		return (
			<div>
				<Card zDepth={2} style={style}>
					<a style={{cursor: 'pointer'}} onClick={this.handleClick}>
						<Paper zDepth={1}>
							<CardTitle title={this.props.title} style={{background: this.props.color}} />
							<div style={color} />
						</Paper>
					</a>
					<CardActions>
						<FlatButton 
							label={this.props.title} 
							icon={<FontIcon className="material-icons">{this.props.icon}</FontIcon>} 
							onClick={this.handleClick}
						/>
					</CardActions>
				</Card>
			</div>
		)
	}
});

export default ActionCard;