var config = require('../../../../config');
const notifDigest = function(user, notifs) {
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
									<h2>Pending Programs</h2>
								  </td>
								</tr>
								<tr>
								  <td class="mui--divider-top">
									`+user.name+`,
								  </td>
								</tr>
								<tr>
								  <td>
									Below is a table of pending programs awaitng your approval in the portal. Keep in mind a program may have been processed since this email was generated.
								  </td>
								</tr>
								<tr>
								  <td>
								  	<table 
								  	  class="mui--text-center mui-table--bordered"
								  	  border="0"
								  	  cellpadding="0"
								  	  cellspacing="0"
								  	  width="100%"
								  	>
								  	  <thead>
								  	    <th>ID</th>
								  	    <th>Title</th>
								  	    <th>Action</th>
								  	  </thead>
								  	  <tbody>
									  	`+generateTable(notifs)+`
								  	  </tbody>
								  	</table>
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

function generateTable(notifs) {
	var w;
	var host = config.mailLinkBack + ':' + config.frontendPORT;
	var table = '';
	notifs.map(function(notif) {
		w = notif.workorder;
		table +=`<tr>
				<td>`+w.searchId+`</td>
				<td>`+w.title+`</td>
				<td>
					<table
						class="mui-btn mui-btn--raised"
						border="0"
						cellspacing="0"
						cellpadding="0"
					>
					  <tr>
						<td>
						  <a href="http://`+host+`/job/Programs/View/Programs/`+w._id+`">View</a>
						</td>
					  </tr>
					</table>
				</td>
			</tr>`;
	});
	return table
}

module.exports = notifDigest;