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
const version = versionId();

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
app.set('connectedClients', []);

// Start server listening on configured IP:PORT
const server = app.listen(PORT, IP, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at ' + IP + ':' + PORT);
});
const io = require('socket.io')(server);
app.set('socketio', io);

// handle incoming socket connections
io.on('connect', function(socket) {
  var socketId = socket.id;

  // maintain online users list
  socket.on('disconnect', function() {
    var connectedClients = app.get('connectedClients');
    var remainingClients = [];
    for(var client in connectedClients) {
      if(connectedClients[client].socketId !== socketId) remainingClients[connectedClients[client].userId] = connectedClients[client];
    }
    app.set('connectedClients', remainingClients);
  });

  // maintain online users list
  socket.on('clientConnected', function(userId) {
    var connectedClients = app.get('connectedClients');
    connectedClients[userId] = {userId: userId, socketId: socketId, date: new Date()};
    app.set('connectedClients', connectedClients);
  });

  // reply to client with current versionId
  socket.on('version-check', function() {
    socket.emit('version-number', version);
  });
});

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

// generate version string for server client synchronization
function versionId() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}