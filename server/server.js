const express = require('express');
const path = require('path');
const WebSocket = require('ws');


const app = express();
const PORT = process.env.PORT || 5000;

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Answer API requests.
app.get('/api', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"Hello from the custom server!"}');
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

let server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});

/**
 * Create WS server.
 */
var wss = new WebSocket.Server({ server });
var wsId = 0;
var lookup = {};
var lobbies = {};

wss.on('connection', function connection(ws) {
  wsId++;
  lookup[wsId] = ws;
  ws.send(JSON.stringify({ type: 'open', payload: wsId }));


  //connection is up, let's add a simple simple event
  ws.on('message', function incoming(message) {
    var obj = JSON.parse(message);
    switch (obj.type){
      case 'lobby':
        lobbies[obj.payload] = lobbies[obj.payload] || {};
        break;
      case 'connectToLobby':
        var lobby = obj.lobby;

        if (lobbies[lobby].playerOne) {
          lobbies[lobby].playerTwo = obj.playerId;
          var playerOneId = lobbies[lobby].playerOne;
          var playerTwoId = obj.playerId;

          lookup[playerTwoId].send(
            JSON.stringify({ 
              type: 'addPlayer', 
              payload: playerOneId
            }));

          lookup[playerOneId].send(
            JSON.stringify({ 
              type: 'addPlayer', 
              payload: playerTwoId
            }));

        } else {
          lobbies[lobby].playerOne = obj.playerId;
        }
        break;
      case 'newMoveMade':
        var player = obj.player;
        lookup[player].send(JSON.stringify({
          type: 'newMoveReceieved',
          move: obj.move,
        }));
        break;
      case 'newPassMade':
        player = obj.player;
        lookup[player].send(JSON.stringify({
          type: 'newPassReceieved',
        }));
        break;
      case 'sendNewMessage':
        var recipientId = obj.recipientId;

        var messageToSend = {
          type: 'addMessage',
          payload: {
            playerId: obj.playerId,
            text: obj.message,
          },
        };

        lookup[obj.recipientId].send(JSON.stringify(messageToSend));
        break;
      default:
        break;
    }
  });
});

