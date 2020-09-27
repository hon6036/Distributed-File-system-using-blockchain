'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const util = require('util');
const path = require('path');
const fs = require('fs');

let network = require('../src/fabric/network.js');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

//use this identity to query

//get all assets in world state
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


//vote for some candidates. This will increase the vote count for the votable objects
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
const srv = app.listen(process.env.PORT || 8080);