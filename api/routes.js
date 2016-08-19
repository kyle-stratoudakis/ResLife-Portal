const routes = require('express').Router();
const getJobs = require('./getJobs');
const programs = require('./jobs/programs');
const hallcouncil = require('./jobs/hallcouncil');
const techsupport = require('./jobs/techsupport');
const aggregate = require('./services/email/aggregate');
const generatePcard = require('./services/email/standAlonePcard');
const getDateTime = require('./utils/getDateTime');

routes.use('/getJobs', getJobs);
routes.use('/programs', programs);
routes.use('/hallcouncil', hallcouncil);
routes.use('/techsupport', techsupport);

routes.get('/aggregateNotifs', function(req, res) {
	if(req.query.hour) {
		var currentHour = parseInt(req.query.hour, 10);
		aggregate(currentHour);
		res.status(200).send(getDateTime(new Date(), new Date()) + ', aggregate OK\n');
	}
});

routes.get('/pcard', function(req, res) {
	if(req.query.id) {
		var filename;
		filename = generatePcard(req.query.id);
		res.status(200).send(new Date().toUTCString() + ' printed pdf for ' + req.query.id);
	}
});

module.exports = routes;