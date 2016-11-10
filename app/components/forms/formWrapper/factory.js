import hoistStatics from 'hoist-non-react-statics';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import FlatButton from 'material-ui/FlatButton';

export default function factory(React, empty) {
	const { Component } = React
	
	function wrapComponent(DecoratedComponent) {
		
		class FormWrapper extends Component {
			constructor(props) {
				super(props)

				this.state = {
					open: false,
					label: ' Work order',
					action: 'New'
				};
			}

			componentWillMount() {
				let location = this.props.params['_job'];
				let action = this.props.location.pathname.split('/')[3];
				let label = ' Work order';

				if(location === 'Programs') {
					label = ' Program';
				}
				else if(location === 'Funding') {
					label = ' Funding Request';
				}
				else if(location === 'Graphics') {
					label = ' Graphics Request';
				}
				else if(location === 'TechSupport') {
					label = ' Tech Request';
				}

				this.setState({
					open: false,
					label: label,
					action: action
				});

				if(this.props.params['_id']) {
					let id = this.props.params['_id'];
					let jwt = this.props.token.jwt;
					let location = this.props.params['_job'];
					this.props.fetchDetails(location, '?jwt='+jwt+'&id='+id)
				}
			}


			onSubmit(formData) {
				// console.log(formData)
				let location = this.props.params['_job'];
				let index = this.props.jobs.findIndex((job) => job.link === location);
				let jobId = this.props.jobs[index]._id;
				if(this.props.params['_id']) {
					this.props.updateForm(this.props.token.jwt, location, this.props.params['_id'], jobId, formData)
				}
				else {
					this.props.submitForm(this.props.token.jwt, location, jobId, formData)
				}
			}

			render() {
				const title = 'Delete' + this.state.label;

				const content = [
					<center>
						{'Are you sure you want to delete this' + this.state.label + '?'}
						<br />
						<br />
						<p style={{color: '#f44336'}}>
							{'Deletion cannot be undone.'}
						</p>
					</center>
				]

				const actions = [
					<FlatButton
						key='cancel'
						label='Cancel'
						onClick={this.props.closeDialog.bind(this)}
					/>,
					<FlatButton
						key='delete'
						label='Delete'
						hoverColor='#ef5350'
						onClick={this.props.deleteWorkorder.bind(this, this.props.details)}
					/>,
				]

				return (
					<div className='container'>
						<br/>
						<Paper style={ {'padding': '0 1rem 3rem 2rem' } } zDepth={2}>
							<div className='row' style={{ margin: 'auto' }}>
								<div className='col-sm-11'>
									<h2>{this.state.action + this.state.label}</h2>
								</div>
								<div className='col-sm-1'>
									<IconMenu
										iconButtonElement={<IconButton><MoreHorizIcon /></IconButton>}
										anchorOrigin={{horizontal: 'right', vertical: 'top'}}
										targetOrigin={{horizontal: 'right', vertical: 'top'}}
									>
										<MenuItem
											primaryText={'Delete' + this.state.label}
											disabled={(this.props.details._id ? false : true)}
											onClick={this.props.openDialog.bind(this, title, content, actions)}
										/>
										<MenuItem
											primaryText='Email User'
											disabled={(this.props.details.email ? false : true)}
											onClick={this.props.emailUser.bind(this, this.props.details)}
										/>
										<MenuItem
											primaryText='Download Form'
											disabled={this.props.details.approved ? false : true}
											onClick={this.props.downloadPdf.bind(this, this.props.details, this.props.details.application)}
										/>
									</IconMenu>
								</div>
							</div>
							<DecoratedComponent {...this.props} onSubmit={this.onSubmit} workOrder={this.props.details} />
						</Paper>
					</div>
				)
			}
		}
		return hoistStatics(FormWrapper, DecoratedComponent)
	}
	return wrapComponent
}
