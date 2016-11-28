const routes = require('express').Router();
const getJobs = require('./getJobs');
const programs = require('./jobs/programs');
const funding = require('./jobs/pcardrequest');
const graphics = require('./jobs/graphics');
const hallcouncil = require('./jobs/hallcouncil');
const techsupport = require('./jobs/techsupport');
const administrator = require('./jobs/administrator');
const aggregate = require('./services/email/aggregate');
const getDateTime = require('../utils/getDateTime');

routes.use('/getJobs', getJobs);
routes.use('/programs', programs);
routes.use('/graphics', graphics);
routes.use('/funding', funding);
routes.use('/hallcouncil', hallcouncil);
routes.use('/techsupport', techsupport);
routes.use('/administrator', administrator);

routes.get('/aggregateNotifs', function(req, res) {
	if(req.query.hour) {
		var currentHour;
		if(currentHour = parseInt(req.query.hour, 10)) {
			aggregate(currentHour);
			res.status(200).send(getDateTime(new Date(), new Date()) + ', aggregate OK\n');
		}
		else if(req.query.hour === 'test') {
			res.status(200).send(getDateTime(new Date(), new Date()) + ', Test OK\n').end();
		}
	}
});

module.exports = routes;