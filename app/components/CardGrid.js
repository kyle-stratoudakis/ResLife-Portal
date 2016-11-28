import React from 'react';
import JobCard from './JobCard';

const CardGrid = React.createClass({
	componentWillMount () {
		this.socket = io();
		this.socket.emit('clientConnected', this.props.token.user._id);

		if(!this.props.jobs) {
			this.props.fetchJobs(this.props.token.jwt);
		}
	},

	renderJob (job, i) {
		let col;
		let height;

		if(i === 0){
			col = 12;
			height = 6;
		}

		if(i === 1 || i === 2) {
			col = 6;
			height = 4.5;
		}

		if(i > 2) {
			col = 3;
			height = 3;
		}

		let endpoint = job.link +'/'+ this.props.jobs[i].endpoints[0].route +"&jwt="+ this.props.token.jwt +"&job="+ job._id;
		return (
			<div className={"col-sm-" + col} key={i}>
				<br /> <br />
				<JobCard 
					title={job.title}
					subTitle={job.subtitle}
					link={job.link}
					performRouteAndUpdate={this.props.performRouteAndUpdate}
					endpoint={endpoint}
					color={job.color}
					titleColor={job.title_color}
					height={height}
					actions={job.card_actions}
				/>
			</div>
		)
	},

	render () {
		return (
			<div className="container">
				{this.props.jobs.map(this.renderJob)}
			</div>
		)
	}
});

export default CardGrid;