'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const util = require('util');
const http = require('http')
const app = express()
app.use(cors());
const server = http.createServer(app)
const io = require('socket.io')(server)
let network = require('../src/fabric/network.js');

app.use(morgan('combined'));
app.use(bodyParser.json());
const peerlist = {}

io.on('connection', function (socket) {
  console.log('Connection with ID:', socket.id);
  socket.on('id', function(data) {
    peerlist[data.user] = data.socketID
    console.log(peerlist)
  })
  socket.on('find', function(data) {
    console.log(data)
    console.log(peerlist[data.issuer])
    console.log(data.socketID)
    var socket_sender = io.sockets.connected[peerlist[data.issuer]]
    var socket_receiver = io.sockets.connected[data.socketID]
    console.log("sender")
    socket_sender.emit('peer', {
      socketid: data.socketID,
      fileName: data.fileName,
      initiator: true      
    })
    console.log("reveiver")
    socket_receiver.emit('peer', {
      socketid: peerlist[data.issuer],
      initiator: false
    })
  })
  
  socket.on('signal', function(data) {
    var socket2 = io.sockets.connected[data.peerId]
    socket2.emit('signal', {
      signal:data.signal,
      peerId: socket.id
    })
  })
});

app.post('/search', async (req, res) => {
  let args = req.body
  console.log(args)
  let networkObj = await network.connectToNetwork(req.body.issuer);
  let response = await network.invoke(networkObj, true, 'search', args);
  console.log(response)
  console.log("response")
  let parsedResponse = await JSON.parse(response);
  console.log(parsedResponse)
  res.send(parsedResponse);

});

app.post('/upload', async (req, res) => {
  let networkObj = await network.connectToNetwork(req.body.issuer);
  console.log('util inspecting');
  console.log(util.inspect(networkObj));
  console.log('req.body');
  console.log(req.body);
  let args = req.body;

  let response = await network.invoke(networkObj, false, 'upload', args);
  if (response.error) {
    res.send(response.error);
  } else {
    console.log('response: ');
    console.log(response);
    // let parsedResponse = await JSON.parse(response);
    res.send(response);
  }
});

app.post('/registerUser', async (req, res) => {
  console.log('req.body: ');
  console.log(req.body);
  let userName = req.body.name;

  //first create the identity for the voter and add to wallet
  let networkObj = await network.registerUser(userName);
  console.log('networkobj: ');
  console.log(networkObj);
  if (networkObj.error) {
    res.send(networkObj.error);
  }
  else {
    res.send(networkObj)
  }
});

app.post('/queryAll', async (req, res) => {
  let networkObj = await network.connectToNetwork(req.body.issuer);
  console.log(networkObj)
  console.log('networkObj');

  let response = await network.invoke(networkObj, false, 'queryAll');
  if (response.error) {
    res.send(response.error);
  } else {
    console.log('response: ');
    console.log(response);
    let parsedResponse = await JSON.parse(response)
    res.send(parsedResponse);
  }
});
server.listen(process.env.PORT || 8080);