const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config.dev');
const routes = require('./api/routes');
const m_allowCORS = require('./api/middleware/allowCORS');
const accessConfig = require('../config');
const login = require('./api/login');
const NoAD_login = require('./api/NoAD_login');
const app = express();
const compiler = webpack(config);

const IP = accessConfig.IP || 'localhost';
const PORT = accessConfig.PORT || '9080';
const HOST = accessConfig.HOST || 'localhost:9080';
const PROTOCOL = accessConfig.PROTOCOL || 'http://';

app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: true,
	publicPath: config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

app.use(m_allowCORS);
app.use('/login', NoAD_login)
// app.use('/login', login)
app.use('/api', routes)

// Start server listening on configured IP:PORT
const server = app.listen(PORT, IP, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at ' + IP + ':' + PORT);
});

// Socket.io - Requires server instance on instantiation
const io = require('socket.io')(server);

// Redirect away from blank root route
app.get('/', function(req, res) {
	res.redirect(PROTOCOL+HOST+'/Home');
});

// Serves image for tab and shortcut icon
app.get('/favicon', function(req, res) {
	res.sendFile(path.join(__dirname, './app/data/residence-life-logo@96x96.png'));
});

// Wildcard route serves React App
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});