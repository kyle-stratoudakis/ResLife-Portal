const routes = require('express').Router();
const getJobs = require('./getJobs');
const programs = require('./jobs/programs');
const hallcouncil = require('./jobs/hallcouncil');
const techsupport = require('./jobs/techsupport');
const aggregate = require('./services/email/aggregate');
const generatePcard = require('./services/email/standAlonePcard')

routes.use('/getJobs', getJobs);
routes.use('/programs', programs);
routes.use('/hallcouncil', hallcouncil);
routes.use('/techsupport', techsupport);

routes.get('/aggregateNotifs', function(req, res) {
	if(req.query) {
		var currentHour = parseInt(req.query.hour, 10);
		aggregate(currentHour);
		res.sendStatus(200);
	}
});

routes.get('/pcard', function(req, res) {
	if(req.query.id) {
		var filename;
		filename = generatePcard(req.query.id);
		res.sendStatus(200);
	}
});

module.exports = routes;