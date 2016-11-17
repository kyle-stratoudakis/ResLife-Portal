const pdfkit = require('pdfkit');
const fs = require('fs');
const getDate = require('../../../utils/getDate');
const getDateTime = require('../../../utils/getDateTime');
const Transform = require('stream').Transform;

const Resolution = function(program) {
	var margins = {top: 72, bottom: 0, left: 72, right: 72};
	var info = {Title: 'Hall Council Resolution: ' + program.searchId, Author: 'SCSU Office of Residence Life', Subject: program.title};
	var doc = new pdfkit({margins: margins, info: info});
	var stream = new Transform;
	var descLength = 1800;
	
	// write document to stream
	doc.pipe(stream);

	// write stream data to response
	stream._write = function (chunk, enc, next) {
	    next();
	};

	// required for transform stream
	stream._transform = function (chunk, encoding, done) {
		done()
	};

	// Header logo image
	doc.image('./api/services/email/emailTemplates/residence-life-logo.png', 25, 40, {width: 160});

	// Title
	doc.fontSize(16);
	doc.text('Southern Connecticut State University', {align: 'center'});
	doc.fontSize(20);
	doc.text('Office of Residence Life', {align: 'center'});
	doc.fontSize(14);
	doc.text('Hall Council Resolution', {align: 'center'});
	
	/*Program info table*/
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
	// Program Date of meeting, Motioned By, Seconded By
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.text('________________________________________________________________________________________________________________________');
	doc.fontSize(12);
	doc.moveDown(0.25);
	doc.fillColor('black');
	doc.text(getString('Date of Meeting', 30) + getString('Motioned By', 40) + 'Seconded By', {indent: 10, characterSpacing: 0.25, lineGap: -5});
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.text('________________________________________________________________________________________________________________________');
	doc.fontSize(12);
	doc.fillColor('black');
	doc.moveDown(0.25);
	doc.text(getString(getDate(program.councilDate), 35) + getString(program.councilMotioned, 40) + program.councilSeconded, {indent: 10, characterSpacing: 0.25, lineGap: -5} );
	doc.moveDown(0.5);
	// Program Number in Favor, Number Opposed, Number Abstained
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.text('________________________________________________________________________________________________________________________');
	doc.fontSize(12);
	doc.fillColor('black');
	doc.text(getString('In Favor', 40) + getString('Opposed', 40) + 'Abstained', {indent: 10, characterSpacing: 0.25, lineGap: -5});
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.text('________________________________________________________________________________________________________________________');
	doc.fontSize(12);
	doc.moveDown(0.25);
	doc.fillColor('black');
	doc.text(getString(program.councilFavor, 45) + getString(program.councilOpposed, 45) + program.councilAbstained, {indent: 10, characterSpacing: 0.25, lineGap: -5});
	doc.moveDown(0.5);
	// Program Council Approval
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.text('________________________________________________________________________________________________________________________');
	doc.fontSize(12);
	doc.moveDown(0.25);
	doc.fillColor('black');
	doc.text('Council Approval', {indent: 10, characterSpacing: 0.25, lineGap: -5});
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.text('________________________________________________________________________________________________________________________');
	doc.fontSize(14);
	doc.fillColor('black');
	doc.moveDown(0.25);
	doc.text(program.councilApproval.toUpperCase(), {indent: 10, characterSpacing: 0.25});
	// Program director apporval
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
	if(program.checked) {
		doc.fontSize(12);
		doc.text('Checked: ' + program.checked.name + ', ' + getDateTime(program.checkedDate, program.checkedDate), {indent: 10});
	}
	else {
		descLength -= 112;
		doc.fontSize(8);
		doc.moveDown(2.75);
		doc.text('Checked __________________________________________________________________ Date ___________________', {indent: 10});
	}

	if(program.reviewed) {
		doc.fontSize(12);
		doc.text('Reviewed: ' + program.reviewed.name + ', ' + getDateTime(program.reviewedDate, program.reviewedDate), {indent: 10});
	}
	else {
		descLength -= 112;
		doc.fontSize(8);
		doc.moveDown(3);
		doc.text('Reviewed __________________________________________________________________ Date ___________________', {indent: 10});
	}

	if(program.approved) {
		doc.fontSize(12);
		doc.text('Approved: ' + program.approved.name + ', ' + getDateTime(program.approvedDate, program.approvedDate), {indent: 10});
	}
	else {
		descLength -= 112;
		doc.fontSize(8);
		doc.moveDown(3);
		doc.text('Approved __________________________________________________________________ Date ___________________', {indent: 10});
		doc.moveDown(0.5)
	}
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
	doc.text(getString(program.description, descLength), {indent: 10, characterSpacing: 0.25});
	// Program Notes

	// Timestamp
	doc.fontSize(7);
	doc.fillColor('grey');
	doc.text('________________________________________________________________________________________________________________________', 72, 750);
	doc.text(getDate(new Date()) + ' Southern Connecticut State University, Office of Residence Life', 72, 760);
	
	doc.end();
	return doc;
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

module.exports = Resolution;