import React from 'react';
import JobCard from './JobCard';
import { Link } from 'react-router';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as colors from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar'
import Card from 'material-ui/Card'
import CardTitle from 'material-ui/Card/CardTitle'
import FontIcon from 'material-ui/FontIcon'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import Paper from 'material-ui/Paper'
import Snackbar from 'material-ui/Snackbar'
import Subheader from 'material-ui/Subheader'
import { NavigationMoreVert } from 'material-ui/svg-icons';

const Main = React.createClass({
	renderJob (job, i) {
		return (
			<div className="container-fluid" key={i}>
				<br />
				<JobCard 
					title={job.title}
					link={job.link}
					performRouteAndUpdate={this.props.performRouteAndUpdate}
					endpoint={this.props.jobs[i].endpoints[0].route + "&jwt=" + this.props.token.jwt + "&job=" + job._id}
					color={job.color}
					titleColor={job.title_color}
					height={2}
					actions={job.card_actions}
				/>
			</div>
		)
	},

	render () {
		let iconElementRight = (
			<div>
				<label style={{color: '#FAFAFA'}}>{(this.props.token.user ? this.props.token.user.name : '')}</label>
				<IconMenu
					iconButtonElement={<IconButton><NavigationMoreVert color='#FAFAFA'/></IconButton>}
					anchorOrigin={{horizontal: 'right', vertical: 'top'}}
					targetOrigin={{horizontal: 'right', vertical: 'top'}}
				>
					{/*<MenuItem primaryText="Refresh" />*/}
					{/*<MenuItem primaryText="Send feedback" />*/}
					<MenuItem primaryText="Sign out" onClick={this.props.logOut} />
				</IconMenu>
			</div>
		)
		return (
			<MuiThemeProvider muiTheme={getMuiTheme()}>
				<div className="app">
					<nav className="navbar-fixed-top">
						<AppBar
							title={this.props.appbar.title}
							style={{background: this.props.appbar.color}}
							onLeftIconButtonTouchTap={this.props.toggleNav}
							iconElementRight={iconElementRight} 
						/>
						<Drawer open={this.props.drawer.open} onRequestChange={this.props.toggleNav} docked={false} style={{background: '#E0E0E0'}}>
							<AppBar title="Menu" style={{background: colors.grey700}} onLeftIconButtonTouchTap={this.props.toggleNav} />
							<br />
							<div className="container-fluid">
								<Link to="/Home">
									<Card zDepth={2}>
										<Paper zDepth={1}>
											<CardTitle title="Home" style={{background: colors.blue500}} titleColor={colors.white}/>
											<div style={{background: colors.blue500}} />
										</Paper>
									</Card>
								</Link>
							</div>
							
							{this.props.jobs.map(this.renderJob)}

						</Drawer>
					</nav>
					<br /><br /><br />
					{React.cloneElement(this.props.children, this.props)}
					<Snackbar
						open={this.props.snackbar.open || false}
						message={this.props.snackbar.message}
						autoHideDuration={this.props.snackbar.autoHideDuration}
						// onRequestClose={this.props.snackbar.onRequestClose}
					/>
					<br /><br /><br />
				</div>
			</MuiThemeProvider>
		)
	}
});

export default Main;