const pdfkit = require('pdfkit');
const fs = require('fs');

const pcardAuthForm = function(program) {
	// console.log(program)
	var margins = {top: 72, bottom: 0, left: 72, right: 72};
	var info = {Title: 'P-Card Authorization: ' + program.searchId, Author: 'SCSU Office of Residence Life', Subject: ''};
	var filename = './api/services/email/sentForms/pcard-'+ program._id +'.pdf';
	var doc = new pdfkit({margins: margins, info: info});

	doc.pipe(fs.createWriteStream(filename));

	// Title
	doc.fontSize(16);
	doc.text('Southern Connecticut State University', {align: 'center'});
	doc.fontSize(20);
	doc.text('Office of Residence Life', {align: 'center'});
	doc.fontSize(14);
	doc.text('P-Card Authorization', {align: 'center'});

	// Legal copy
	doc.fontSize(7);
	doc.fillColor('gray');
	doc.moveDown();
	doc.text('This form will be completed when seeking permission for Southern Connecticut State University (SCSU) to allow you to purchase the goods and/or services listed on this form through the use of a University issued Procurement Card (P-Card). Should SCSU grant permission for you to use the P-Card, such authorization represents the University’s trust in you as a student representative for the University. Use of the granted P-Card shall be on a temporary basis and shall ONLY BE USED BY YOU.');
	doc.moveDown(0.5);
	doc.text('By way of your signature below, you agree that:');
	doc.moveDown(0.5);
	doc.text('1. The P-Card shall be used for official University purchases only, and all of your P-Card purchases shall be consistent with the University’s', {indent: 30});
	doc.text('    procurement policies and procedures;', {indent: 30});
	doc.moveDown(0.25);
	doc.text('2. The P-card shall not be used for personal purchases of any kind, nor shall the P-Card be loaned to other individuals;', {indent: 30});
	doc.moveDown(0.25);
	doc.text('3. The P-Card shall be kept secure within your possession at all times and shall be returned to the Director of Residence Life (or his/her', {indent: 30});
	doc.text('    designee) within 24 hours (or next business day) following completion of your authorized purchase transaction(s);', {indent: 30});
	doc.moveDown(0.25);
	doc.text('4. You shall be solely responsible for the P-Card while it is in your possession and immediately report any lost or stolen P-Cards to:', {indent: 30});
	doc.text('i. Office of Residence Life - (203) 392-5870', {indent: 50});
	doc.text('ii. Administrative Support Services - (203) 392-5266', {indent: 50});
	doc.text('iii. JP Morgan Chase - (800) 316-6056', {indent: 50});
	doc.moveDown(0.25);
	doc.text('5. All purchases made using the P-Card within the State of Connecticut shall not bear any sales tax (sales tax exemption number is listed on', {indent: 30});
	doc.text('    the P-Card);', {indent: 30});
	doc.moveDown(0.25);
	doc.text('6. You shall obtain proper documentation and itemized receipts for all transactions associated with the use of the P-Card, and such', {indent: 30});
	doc.text('    documentation and itemized receipts shall be returned with the P-Card to the Director of Residence Life within 24 hours (or next business', {indent: 30});
	doc.text('    day) following completion of your authorized purchase transaction(s);', {indent: 30});
	doc.moveDown(0.25);
	doc.text('7. You shall be responsible for re-payment of any charges deemed inappropriate (including the charge of sales tax) by direct reimbursement', {indent: 30});
	doc.text('    to SCSU and no further P-Card authorizations shall be allowed until such payment is settled;', {indent: 30});
	doc.moveDown(0.25);
	doc.text('8. Your right to use the P-Card may be terminated by SCSU at any time for any reason;', {indent: 30});
	doc.moveDown(0.25);
	doc.text('9. Any violation of SCSU’s P-Card policies may be subject to disciplinary action including expulsion or arrest.', {indent: 30});
	doc.moveDown(0.25);
	
	// Program info table
	// User Name Email Phone
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.text('________________________________________________________________________________________________________________________');
	doc.fontSize(12);
	doc.fillColor('black');
	doc.text(getString('Name', 45) + getString('Email', 45) + 'Phone', {indent: 10, characterSpacing: 0.25, lineGap: -5});
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.text('________________________________________________________________________________________________________________________');
	doc.fontSize(12);
	doc.moveDown(0.25);
	doc.fillColor('black');
	doc.text(getString(program.name, 40) + getString(program.email, 30) + program.primary_contact, {indent: 10, characterSpacing: 0.25, lineGap: -5});
	doc.moveDown(0.5);
	// Program ID Title Amount
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.text('________________________________________________________________________________________________________________________');
	doc.fontSize(12);
	doc.fillColor('black');
	doc.text(getString('ID', 25) + getString('Title', 75) + 'Amount', {indent: 10, characterSpacing: 0.25, lineGap: -5});
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.text('________________________________________________________________________________________________________________________');
	doc.fontSize(12);
	doc.moveDown(0.25);
	doc.fillColor('black');
	doc.text(getString(program.searchId, 20) + getString(program.title, 60) + program.funding, {indent: 10, characterSpacing: 0.25, lineGap: -5});
	doc.moveDown(0.5);
	// Program Date, Time Type, Location
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.text('________________________________________________________________________________________________________________________');
	doc.fontSize(12);
	doc.moveDown(0.25);
	doc.fillColor('black');
	doc.text(getString('Date, time', 30) + getString('Type', 40) + 'Location', {indent: 10, characterSpacing: 0.25, lineGap: -5});
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.text('________________________________________________________________________________________________________________________');
	doc.fontSize(12);
	doc.fillColor('black');
	doc.moveDown(0.25);
	doc.text(getString(getDateTime(program.date, program.time), 23) + getString(program.type, 40) + program.location, {indent: 10, characterSpacing: 0.25, lineGap: -5} );
	doc.moveDown(0.5);
	// Program Description
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.text('________________________________________________________________________________________________________________________');
	doc.fontSize(12);
	doc.moveDown(0.25);
	doc.fillColor('black');
	doc.text('Description', {indent: 10, characterSpacing: 0.25, lineGap: -5});
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.text('________________________________________________________________________________________________________________________');
	doc.fontSize(12);
	doc.fillColor('black');
	doc.moveDown(0.25);
	doc.fontSize(10);
	doc.text(getString(program.description, 375), {indent: 10, characterSpacing: 0.25} );
    doc.moveDown(0.5);
	// Program Approvers
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.text('________________________________________________________________________________________________________________________');
	doc.fontSize(12);
	doc.moveDown(0.25);
	doc.fillColor('black');
	doc.text('Approval', {indent: 10, characterSpacing: 0.25, lineGap: -5});
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.text('________________________________________________________________________________________________________________________');
	doc.fontSize(12);
	doc.fillColor('black');
	doc.moveDown(0.25);
	if(program.checked) doc.text('Checked: ' + program.checked.name + ', ' + getDateTime(program.checkedDate, program.checkedDate), {indent: 10});
	doc.text('Reviewed: ' + program.reviewed.name + ', ' + getDateTime(program.reviewedDate, program.reviewedDate), {indent: 10});
	doc.text('Approved: ' + program.approved.name + ', ' + getDateTime(program.approvedDate, program.approvedDate), {indent: 10});
	
	// Signitures
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.text('________________________________________________________________________________________________________________________');
	doc.fontSize(8);
	doc.moveDown(2.5);
	doc.fillColor('black');
	doc.text('Pick up Signature __________________________________________________________________ Date ___________________');
	doc.moveDown(3);
	doc.text('Return and Receipt Signature ________________________________________________________ Date ___________________');
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.moveDown(1);
	doc.text('________________________________________________________________________________________________________________________');
	doc.moveDown(1);

	// Timestamp
	doc.fontSize(7);
	doc.moveDown(1);
	doc.fillColor('grey');
	doc.text(getDate(new Date()) + ' Southern Connecticut State University, Office of Residence Life');
   
	// Header logo image
	doc.image('./api/services/email/emailTemplates/residence-life-logo.png', 25, 40, {width: 160});
	doc.end();

	return filename;
}

function getString(str, size) {
	var s;
	if(str && (str.length > size)) {
		s = padRight(str.substring(0, size), size);
	}
	else {
		s = padRight(str, size);
	}
	return s;
}

function padRight(str, num) {
	while(str && str.length < num) {
		str += ' ';
	}
	return str;
}

function getDateTime(date, time) {
	var t = new Date(time);
	var hr = t.getHours();
	var mn = t.getMinutes();
	var tod = (hr >= 12 ? ' pm' : ' am');
	if(hr > 12) {
		hr = hr - 12;
		tod = ' pm';
	}
	if(mn < 10) {
		mn = '0'+ mn;
	}
	return getDate(date) +', '+ hr +':'+ mn + tod;
}

function getDate(date) {
	var d = new Date(date);
	return (d.getMonth()+1) +'/'+ d.getDate() +'/'+ d.getFullYear();
}

module.exports = pcardAuthForm;