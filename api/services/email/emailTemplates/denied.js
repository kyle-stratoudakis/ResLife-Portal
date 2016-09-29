var config = require('../../../../../config');
const denied = function(status, wo) {
	var host = config.PROTOCOL + config.HOST;
	var message = 'processed';
	var title = 'Program Status Update';
	var location = 'Programs';
	var label = 'Program';
	if(status === 'checked') {
		title = 'Hall Director Approved';
		message = 'denied by your hall director.';
	}
	else if(status === 'reviewed') {
		title = 'Associate Director Approved';
		message = 'denied by an associate director.';
	}
	else if(status === 'approved') {
		title = 'Funding Approved';
		message = 'denied by the department director.';
	}
	else if(status === 'funding') {
		title = 'Awaiting Funding Approval'
		message = 'denied by an associate director and is awaiting funding approval from the department director.';
	}
	else if(status === 'reviewer approved') {
		message = 'denied by an assoicate director.';
	}
	else if(status === 'denied') {
		message = 'denied';
	}
	else if(status === 'rha_checked') {
		title = 'Request Status Update';
		message = 'checked by RHA board member.';
		location = 'Funding';
		label = 'Request';
	}
	else if(status === 'funding_reviewed') {
		title = 'Request Status Update';
		message = 'approved by an associate director.';
		location = 'Funding';
		label = 'Request';
	}

	return (
		`<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>
		<html xmlns='http://www.w3.org/1999/xhtml'>
		  <head>
			<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
			<meta name='viewport' content='width=device-width' />
			<link href='//cdn.muicss.com/mui-0.6.8/email/mui-email-styletag.css' rel='stylesheet' />
			<link href='//cdn.muicss.com/mui-0.6.8/email/mui-email-inline.css' rel='stylesheet' />
			<style>
				body,
				.mui-body {
				  background-color: #eee;
				  font-size: 15px;
				}

				.mui-container,
				.mui-container-fixed {
				  padding-top: 15px;
				  padding-bottom: 15px;
				}

				#content-wrapper h2 {
				  margin-top: 0px;
				  margin-bottom: 0px;
				}

				#content-wrapper > tbody > tr > td {
				  padding-bottom: 15px;
				}

				#content-wrapper .mui--divider-top {
				  padding-top: 15px;
				}

				#last-cell {
				  padding-bottom: 15px;
				}
			</style>
		  </head>
		  <body>
			<table class='mui-body' cellpadding='0' cellspacing='0' border='0'>
			  <tr>
				<td>
					<center>
					<!--[if mso]><table><tr><td class="mui-container-fixed"><![endif]-->
					<div class="mui-container">
					  <table cellpadding="0" cellspacing="0" border="0" width="100%">
						<tr>
						  <td class="mui-panel">
							<table
								id="content-wrapper"
								border="0"
								cellpadding="0"
								cellspacing="0"
								width="100%"
							>
							  <tbody>
								<tr>
								  <td>
									<h2>`+title+`</h2>
								  </td>
								</tr>
								<tr>
								  <td class="mui--divider-top">
									`+wo.name+`,
								  </td>
								</tr>
								<tr>
								  <td>
									Your `+label.toLowerCase()+` <strong><i>`+wo.title+` </i></strong> has been `+message+` You can view the status of this `+label.toLowerCase()+` by logging into the portal or by clicking the button below.
								  </td>
								</tr>
								<tr>
								  <td>
									<table
										class="mui-btn mui-btn--raised mui--text-center"
										border="0"
										cellspacing="0"
										cellpadding="0"
									>
									  <tr>
										<td>
										  <a href="`+host+`/job/`+location+`/View/`+location+`/`+wo._id+`">Access `+label+`</a>
										</td>
									  </tr>
									</table>
								  </td>
								</tr>
								<tr>
								  <td>
									Thanks,
								  </td>
								</tr>
								<tr>
								  <td id="last-cell">
									SCSU Office of Residence Life
								  </td>
								</tr>
							  </tbody>
							</table>
						  </td>
						</tr>
					  </table>
					</div>
					<!--[if mso]></td></tr></table><![endif]-->
				  </center>
				</td>
			  </tr>
			</table>
		  </body>
		</html>`
	)
}

module.exports = denied;