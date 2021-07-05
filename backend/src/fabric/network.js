'use strict';

const { Wallets, Gateway } = require('fabric-network');
const path = require('path');
const fs = require('fs');

exports.connectToNetwork = async function (userName) {
  console.log(userName)
  const gateway = new Gateway();
  if (userName == "Org1AppUser") {
    try {
      const util = require('util');
      const walletPath = path.join(process.cwd(), 'walletOrg1');
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);
      console.log('userName: ');
      console.log(userName);
      const ccpPath = path.resolve(process.cwd(), '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
  
      console.log('wallet: ');
      console.log(util.inspect(wallet));
      console.log('ccp: ');
      console.log(util.inspect(ccp));

      const userExists = await wallet.get(userName);
      if (!userExists) {
        let response = {};
        response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
        return response;
      }
  
      console.log('before gateway.connect: ');
  
      await gateway.connect(ccp, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true }});
  
      // Connect to our local fabric
      const network = await gateway.getNetwork('mychannel');
  
      console.log('Connected to mychannel. ');
      // Get the contract we have installed on the peer
      const contract = await network.getContract('file');
  
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
    }

  } else {
    try {
      const util = require('util');
      const walletPath = path.join(process.cwd(), 'walletOrg2');
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);
      console.log('userName: ');
      console.log(userName);
      const ccpPath = path.resolve(process.cwd(), '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
  
      console.log('wallet: ');
      console.log(util.inspect(wallet));
      console.log('ccp: ');
      console.log(util.inspect(ccp));

      const userExists = await wallet.get(userName);
      if (!userExists) {
        let response = {};
        response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
        return response;
      }
  
      console.log('before gateway.connect: ');
  
      await gateway.connect(ccp, { wallet, identity: userName });
  
      // Connect to our local fabric
      const network = await gateway.getNetwork('mychannel');
  
      console.log('Connected to mychannel. ');
      // Get the contract we have installed on the peer
      const contract = await network.getContract('file');

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
    }
  }
};

exports.invoke = async function (networkObj, isFunc, func, args) {

  const util = require('util');
  try {
    console.log('inside invoke');
    console.log(`isQuery: ${isFunc}, func: ${func}, args: ${args}`);
    console.log(util.inspect(networkObj));

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
      let response = await networkObj.contract.submitTransaction(func, args["issuer"], args["fileName"], args["fileSize"], args["channel"], args["filePath"]);
      console.log('after submit');
      console.log(response);
      console.log(`Transaction ${func} with args ${args} has been submitted`);

      await networkObj.gateway.disconnect();

      return response;

    } else {
      console.log('inside query');
      console.log(func)
      console.log(networkObj)
      let response = await networkObj.contract.evaluateTransaction(func)
      console.log('after sumit');
      console.log(response)

      let resultsObject = JSON.parse(response);

      resultsObject.forEach((result) => {
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