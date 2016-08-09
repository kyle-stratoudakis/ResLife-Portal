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
					<Link to={"/job/"+this.props.location+"/"+this.props.route}>
						<Paper zDepth={1}>
							<CardTitle title={this.props.title} style={{background: this.props.color}} />
							<div style={color} />
						</Paper>
					</Link>
					<CardActions>
						<FlatButton 
							label={this.props.title} 
							icon={<FontIcon className="material-icons">{this.props.icon}</FontIcon>} 
							onClick={this.props.performRoute.bind(null, "/job/"+this.props.location+"/"+this.props.route)}
						/>
					</CardActions>
				</Card>
			</div>
		)
	}
});

export default ActionCard;