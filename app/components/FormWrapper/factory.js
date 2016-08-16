import hoistStatics from 'hoist-non-react-statics';
import Paper from 'material-ui/Paper'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import RaisedButton from 'material-ui/RaisedButton'

export default function factory(React, empty) {
	const { Component } = React
	
	function wrapComponent(DecoratedComponent) {
		
		class FormWrapper extends Component {
			constructor(props) {
				super(props)
			}

			componentWillMount() {
				// console.log('Form Wrapper Mount');
				if(this.props.params['_id']) {
					let id = this.props.params['_id'];
					let jwt = this.props.token.jwt;
					let location = this.props.params['_job'];
					this.props.fetchDetails(location, '?jwt='+jwt+'&id='+id)
				}
			}

			onSubmit(formData) {
				console.log(formData)
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

			getTitle() {
				let location = this.props.params['_job'];
				let action = this.props.location.pathname.split('/')[3];
				let title = '';

				if(location === 'Programs') {
					title += action + ' Program';
				}
				else if(location === 'TechSupport') {
					title += action + ' Tech Request';
				}

				return title
			}

			render() {
				const center = { 
					marginTop: '1em',
					marginBottom: '1em',
					marginLeft: 'auto', 
					marginRight: 'auto', 
					width: '65%'
				}

				return (
					<div>
						<div className="container" style={center}>
							<br/>
							<Paper style={ {'padding': '0 1rem 3rem 2rem' } } zDepth={2}>
								<div className="row" style={{ margin: 'auto' }}>
									<div className="col-sm-11">
										<h2>{this.getTitle()}</h2>
									</div>
									{/*<div className="col-sm-1">
										<IconMenu
											iconButtonElement={<IconButton><FontIcon className="material-icons">{'settings'}</FontIcon></IconButton>}
											anchorOrigin={{horizontal: 'right', vertical: 'top'}}
											targetOrigin={{horizontal: 'right', vertical: 'top'}}
										>
											<MenuItem primaryText="Refresh" />
											<MenuItem primaryText="Send feedback" />
											<MenuItem primaryText="Sign out" />
										</IconMenu>
									</div>*/}
								</div>
								<DecoratedComponent {...this.props} onSubmit={this.onSubmit} workOrder={this.props.details} />
							</Paper>
						</div>
					</div>
				)
			}
		}

		return hoistStatics(FormWrapper, DecoratedComponent)
	}

	return wrapComponent
}
