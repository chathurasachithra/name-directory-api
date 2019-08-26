const socket = require('socket.io');
const WebSocketService = require('../services/WebSocketService');

module.exports = (server) => {
  const io = socket(server);

  console.log('Socket.io initialized!');

  io.on('connection', (client) => {
    console.log('Socket.io connected!');

    const userOnline = userId => client.broadcast.emit('userOnline', userId);
    client.on('userLoggedIn', user => WebSocketService.userLoggedIn(user, userOnline));

    const updateDashboard = facilityId => client.broadcast.emit('updateDashboard', facilityId);
    client.on('appointmentCreated', appointment => WebSocketService.appointmentCreated(appointment, updateDashboard));
    client.on('phaseUpdated', facilityId => WebSocketService.phaseUpdated(facilityId, updateDashboard));

    const userOffline = userId => client.broadcast.emit('userOffline', userId);
    client.on('userLoggedOut', userId => WebSocketService.userLoggedOut(userId, userOffline));

    client.on('disconnect', () => {
      console.log('Socket.io disconnected!');

      //      userOffline();
    });
  });
};
