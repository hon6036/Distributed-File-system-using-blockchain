'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const util = require('util');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser')

let network = require('../src/fabric/network.js');

const app = express();
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json())

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


// File upload
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
    res.send(response);
  }
});

// Query All
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