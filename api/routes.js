const routes = require('express').Router();
const getJobs = require('./getJobs');
const programs = require('./jobs/programs');
const hallcouncil = require('./jobs/hallcouncil');
const techsupport = require('./jobs/techsupport');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.use('/getJobs', getJobs);
routes.use('/programs', programs);
routes.use('/hallcouncil', hallcouncil);
routes.use('/techsupport', techsupport);

module.exports = routes;