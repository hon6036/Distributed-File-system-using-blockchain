//Import Hyperledger Fabric 1.4 programming model - fabric-network
'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const configPath = path.join(process.cwd(), './aconfig.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
let connection_file = config.connection_file;
// let userName = config.userName;
let gatewayDiscovery = config.gatewayDiscovery;
let appAdmin = config.appAdmin;
let orgMSPID = config.orgMSPID;

// connect to the connection file
const ccpPath = path.join(process.cwd(), connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);



exports.connectToNetwork = async function (userName) {
  
  const gateway = new Gateway();

  try {
    const util = require('util');
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    console.log('userName: ');
    console.log(userName);

    console.log('wallet: ');
    console.log(util.inspect(wallet));
    console.log('ccp: ');
    console.log(util.inspect(ccp));
    // userName = 'V123412';
    const userExists = await wallet.exists(userName);
    if (!userExists) {
      console.log('An identity for the user ' + userName + ' does not exist in the wallet');
      console.log('Run the registerUser.js application before retrying');
      let response = {};
      response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
      return response;
    }

    console.log('before gateway.connect: ');

    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

    // Connect to our local fabric
    const network = await gateway.getNetwork('mychannel');

    console.log('Connected to mychannel. ');
    // Get the contract we have installed on the peer
    const contract = await network.getContract('contract');


    let networkObj = {
      contract: contract,
      network: network,
      gateway: gateway
    };

    return networkObj;

  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    let response = {};
    response.error = error;
    return response;
  } finally {
    console.log('Done connecting to network.');
    // gateway.disconnect();
  }
};

exports.invoke = async function (networkObj, isFunc, func, args) {

  const util = require('util');
  try {
    console.log('inside invoke');
    console.log(`isQuery: ${isFunc}, func: ${func}, args: ${args}`);
    console.log(util.inspect(networkObj));


    // console.log(util.inspect(JSON.parse(args[0])));

    if (func === 'search') {
      console.log('inside search');
      console.log(args);
      let response = await networkObj.contract.evaluateTransaction(func, args["issuer"], args["fileName"], args["fileSize"], args["channel"]);
      console.log('after sumit')
      console.log(response);
      console.log(`Transaction ${func} with args ${args} has been evaluated`);
  
      await networkObj.gateway.disconnect();
  
      return response;
    } else if (func == 'upload') {
      console.log('inside upload');
      console.log(networkObj.contract)
      console.log(args);
      console.log(func);
      let response = await networkObj.contract.submitTransaction(func, args["issuer"], args["fileName"], args["fileSize"], args["channel"]);
      console.log('after submit');  
      console.log(response);
      console.log(`Transaction ${func} with args ${args} has been submitted`);
  
      await networkObj.gateway.disconnect();
  
      return response;

    } else {
      console.log('inside query');
      let response = await networkObj.contract.evaluateTransaction(func)
      console.log('after sumit');
      console.log(response)
      
      let resultsObject = JSON.parse(response);
      
      resultsObject.forEach((result)=> {
        console.log(result);
      });

      await networkObj.gateway.disconnect();

      return response;
    }

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    return error;
  }
};

exports.registerUser = async function (email) {

  console.log('email');
  console.log(email);

  try {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    console.log(wallet);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(email);
    if (userExists) {
      let response = {};
      console.log(`An identity for the user ${email} already exists in the wallet`);
      response.error = `Error! An identity for the user ${email} already exists.`;
      return response;
    }

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists(appAdmin);
    if (!adminExists) {
      console.log(`An identity for the admin user ${appAdmin} does not exist in the wallet`);
      console.log('Run the enrollAdmin.js application before retrying');
      let response = {};
      response.error = `An identity for the admin user ${appAdmin} does not exist in the wallet. 
        Run the enrollAdmin.js application before retrying`;
      return response;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: appAdmin, discovery: gatewayDiscovery });

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();
    console.log(`AdminIdentity: + ${adminIdentity}`);

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register({ affiliation: '', enrollmentID: email, role: 'client' }, adminIdentity);

    const enrollment = await ca.enroll({ enrollmentID: email, enrollmentSecret: secret });
    const userIdentity = await X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
    await wallet.import(email, userIdentity);
    console.log(`Successfully registered ${email}`);
    let response = `Successfully registered ${email}`;
    return response;
  } catch (error) {
    console.error(`Failed to register user + ${email} + : ${error}`);
    let response = {};
    response.error = error;
    return response;
  }
};