const routes = require('express').Router();
const getJobs = require('./getJobs');
const programs = require('./jobs/programs');
const funding = require('./jobs/pcardrequest');
const hallcouncil = require('./jobs/hallcouncil');
const techsupport = require('./jobs/techsupport');
const aggregate = require('./services/email/aggregate');
const generatePcard = require('./services/email/standAlonePcard');
const getDateTime = require('./utils/getDateTime');

routes.use('/getJobs', getJobs);
routes.use('/programs', programs);
routes.use('/funding', funding);
routes.use('/hallcouncil', hallcouncil);
routes.use('/techsupport', techsupport);

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

routes.get('/pcard', function(req, res) {
	if(req.query.id) {
		var filename;
		filename = generatePcard(req.query.id);
		res.status(200).send(getDateTime(new Date(), new Date()) + ' generated pdf id=' + req.query.id);
	}
});

routes.get('/fixNotifs', function(req, res) {
	if(req.query.type) {
		var notifModel = require('./model/notification');
		var model;
		if(req.query.type === 'program') model = require('./model/program');
		if(req.query.type === 'pCard') model = require('./model/pCardRequest');
		if(model) {
			notifModel.find({})
			.populate({
				path: 'workorder',
				select: 'application',
				model: model
			})
			.exec(function(err, notifs) {
				if(!err) {
					for (var i = 0; i < notifs.length; i++) {
						if(notifs[i].workorder) {
							notifs[i].location = notifs[i].workorder.application;
							notifs[i].save(function(err, saved) {
								if(!err) {
									console.log('saved ' + saved.location)
								}
								else {
									console.log(err)
								}
							});
						}
					}
					res.sendStatus(200);
				}
			})
		}
		else {
			res.sendStatus(422);
		}
	}
})

routes.get('/fixWorkorders', function(req, res) {
	if(req.query.type) {
		var model;
		if(req.query.type === 'Programs') model = require('./model/program');
		if(req.query.type === 'Funding') model = require('./model/pCardRequest');
		if(model) {
			model.find({})
			.exec(function(err, workorders) {
				if(!err) {
					for (var i = 0; i < workorders.length; i++) {
						workorders[i].application = req.query.type;
						workorders[i].save(function(err, saved) {
							if(!err) {
								console.log('saved ' + saved.application)
							}
							else {
								console.log(err)
							}
						});
					}
					res.sendStatus(200);
				}
			})
		}
		else {
			res.sendStatus(422);
		}
	}
})

module.exports = routes;