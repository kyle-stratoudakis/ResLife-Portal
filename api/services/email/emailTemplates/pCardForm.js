const pCardForm = function(workorder) {
	return (
		`<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>
		<html xmlns='http://www.w3.org/1999/xhtml'>
		  <head>
		    <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
		    <meta name='viewport' content='width=device-width' />
		    <!-- NOTE: external links are for testing only -->
		    <link href='//cdn.muicss.com/mui-0.6.8/email/mui-email-styletag.css' rel='stylesheet' />
		    <link href='//cdn.muicss.com/mui-0.6.8/email/mui-email-inline.css' rel='stylesheet' />
		  </head>
		  <body>
		    <table class='mui-body' cellpadding='0' cellspacing='0' border='0'>
		      <tr>
		        <td>
	              <div class='mui-container'>
	              	<h2>Southern Connecticut State University </h2>
	              	<h2>P-card Authorization</h2>
	              	<p>This form shall be completed when seeking permission from Southern Connecticut State University (SCSU) to allow you to purchase the goods and/or services listed on this form thru the use of a University issued Procurement Card (P-card). Should SCSU grant permission for you to use the P-card, such authorization represents the University 's trust in you as a student representative for the University. Use of the granted P-card shall be on a temporary basis and shall ONLY BE USED BY YOU.</p>
	              	<ul>
	              		<li>The P-card shall be used for official University purchases only and all your P-card purchases shall be consistent with the University 's procurement policies and procedures.</li>
	              		<li>The P-card shall not be used for personal purchases of any kind nor shall the P-card be loaned to other individuals.</li>
	              		<li>The P-card shall be kept secure within your possession at all times and shall be returned to the Director of Residence Life (or their designee) within 24 hours (or next business day) following completion of your authorized purchase.</li>
	              		<li>You shall be solely responsible for the P-card while it is in your possession and immediately report any lost or stolen P-card to 1) JP Morgan Chase (800-316-6056), 2) Office of Residence Life (203-392-5870), and 3) Administrative Support Services (203-392-5266)</li>
	              		<li>All purchases made using the P-card within the State of Connecticut shall not bear any sales tax (sales tax exemption number is listed on the P-card).</li>
	              		<li>You shall obtain proper documentation and itemized receipts for all transactions associated with the use of the P-card, and such documentation and itemized receipts shall be returned with the P-card to the Director of Residence Life (or her designee) within 24 hours (or next business day) following completion of your authorized purchase transaction(s).</li>
	              		<li>You shall be responsible for the re-payment of any charges deemed inappropriate (including the charge of sales tax) by direct reimbursement to SCSU and no further P-card authorizations shall be allowed until such repayment is settled.</li>
	              		<li>Your right to use the P-card may be terminated by SCSU at any time for any reason.</li>
	              		<li>Any violation of SCSU's P-card policies may be subject to disciplinary action including expulsion or arrest.</li>
	              	</ul>
	              	<p>Please print and complete the attached P-card authorization form and bring it with you when picking up the P-card. If you cannot print the form yourself a copy is available from your hall director.</p>
	              </div>
		        </td>
		      </tr>
		    </table>
		  </body>
		</html>`
	)
}

module.exports = pCardForm;