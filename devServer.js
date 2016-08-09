const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config.dev');
const routes = require('./api/routes');
const aggregate = require('./api/services/email/aggregate');
const accessConfig = require('../config');
const login = require('./api/login');
const NoAD_login = require('./api/NoAD_login');
const app = express();
const compiler = webpack(config);

var IP = accessConfig.frontendIP || 'localhost';
var PORT = accessConfig.frontendPORT || '9080';

const allowCORS_Middleware = function(req, res, next) {
		// res.header('Access-Control-Allow-Origin', 'example.com');
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
}

app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: true,
	publicPath: config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

app.listen(PORT, IP, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at ' + IP + ':' + PORT);
});

app.use(allowCORS_Middleware);
app.use('/login', NoAD_login)
app.use('/api', routes)


app.get('/aggregateNotifs', function(req, res) {
	if(req.query) {
		var currentHour = parseInt(req.query.hour, 10);
		aggregate(currentHour);
		res.sendStatus(200);
	}
});

// app.get('/api/pdf', function(req, res) {
// 	if(req.query) {
// 		if(req.query.form = 'p-card') {
// 			res.sendFile(path.join(__dirname, './services/email/forms/pcard_form.pdf'));
// 		}
// 	}
// });

// Universal route serves React App
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});