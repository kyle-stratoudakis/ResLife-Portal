import React from 'react';
import Formsy from 'formsy-react';
import FormsyText from './forms/Formsy/FormsyText';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import AppBar from 'material-ui/AppBar'
import { Paper, FlatButton } from 'material-ui';
import { red600 } from 'material-ui/styles/colors';
import { FormsySelect } from 'formsy-material-ui/lib';

const Login = React.createClass({
	getInitialState () {
		return {
			styles: {
				centerStyle: {
					marginBottom: '1em',
					marginLeft: 'auto', 
					marginRight: 'auto'
				}
			}
		}
	},

	onSubmit (data) {
		let { redirect } = this.props.location.query;
		this.props.login(data, redirect);
	},

	handleMessage() {
		if(this.props.loginMessage) {
			let message = this.props.loginMessage;
			if(message === 'Incorrect Username or Password') {
				return (
					<div style={{color: red600}}>
						<br />
						{message}
						<br />
						<a target="_blank" href="https://pwreset.southernct.edu/_layouts/PG/login.aspx">Forgot Password?</a>
					</div>
				)
			}
			else if(message === 'Failed to fetch') {
				return (
					<div style={{color: red600}}>
						<br />
						{'Could not login - No Connection'}
						<br />
					</div>
				)
			}
			else if(message === 'No User Found') {
				return(
					<div>
						<Subheader>New User Details</Subheader>
						<FormsyText
							name='name'
							required
							hintText='First Last'
							floatingLabelText='Full Name'
						/>
						<br />
						<FormsyText
							name='primary_contact'
							required
							hintText='Contact phone number'
							floatingLabelText='Phone Number'
						/>
						<br />
						<FormsySelect
							name='hall'
							required
							floatingLabelText='Hall'
						>
							<MenuItem value='Brownell' primaryText='Brownell' />
							<MenuItem value='Chase' primaryText='Chase' />
							<MenuItem value='Farnham' primaryText='Farnham' />
							<MenuItem value='Hickerson' primaryText='Hickerson' />
							<MenuItem value='Neff' primaryText='Neff' />
							<MenuItem value='North' primaryText='North (Townhouse or Midrise)' />
							<MenuItem value='Schwartz' primaryText='Schwartz' />
							<MenuItem value='West' primaryText='West Campus' />
							<MenuItem value='Wilkinson' primaryText='Wilkinson' />
						</FormsySelect>
					</div>
				)
			}
		}
	},

	render () {
		let { centerStyle } = this.state;
		return (
			<MuiThemeProvider muiTheme={getMuiTheme()}>
				<div className='app'>
					<nav className='navbar-fixed-top'>
						<AppBar
							title='Login'
							style={{background: this.props.appbar.color}}
						/>
					</nav>
					<br /><br /><br />
					<div className='col-sm-4'></div>
					<div className='container col-sm-4'>
						<br />
						<Formsy.Form
							ref='form'
							onValidSubmit={this.onSubmit}
						>
							<Paper>
								<div className='text-center'>
								<br />
									<img src={require('../data/residence-life-logo.png')} alt='ResLifeLogo'/>
									<br />
									<FormsyText
										required
										// autoComplete='off'
										ref='username'
										name='username'
										hintText='MySCSU Username'
										floatingLabelText='Username'
									/>
									<br />
									<FormsyText
										required
										ref='password'
										name='password'
										type='password'
										hintText='MySCSU Password'
										floatingLabelText='Password'
									/>
									<br />
									{this.handleMessage()}
									<br />
									<div className='row'>
										<FlatButton label='Log In' type='submit' backgroundColor={'#E0E0E0'} hoverColor={'#BDBDBD'}/>
									</div>
									<br />
								</div>
							</Paper>
						</Formsy.Form>
					</div>
					<div className='col-sm-4'></div>
					<br /><br /><br />
				</div>
			</MuiThemeProvider>
		)
	}
});

export default Login;