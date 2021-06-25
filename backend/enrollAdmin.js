/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
      // Org1의 connectionProfile 가져오기
      const ccpPath = path.resolve(process.cwd(), '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // CA와 상호작용하는 CA client 생성
      const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
      const caTLSCACerts = caInfo.tlsCACerts.pem;
      const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

      // Org1의 wallet 생성
      const walletPath = path.join(process.cwd(), 'walletOrg1');
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // admin이 있는지 확인
      const identity = await wallet.get('admin');
      if (identity) {
          console.log('An identity for the ORG1 admin user "admin" already exists in the wallet');
          return;
      }

      // admin enroll
      const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
      const x509Identity = {
          credentials: {
              certificate: enrollment.certificate,
              privateKey: enrollment.key.toBytes(),
          },
          mspId: 'Org1MSP',
          type: 'X.509',
      };
      await wallet.put('admin', x509Identity);
      console.log('Successfully enrolled ORG1 admin user "admin" and imported it into the wallet');

  } catch (error) {
      console.error(`Failed to enroll ORG1 admin user "admin": ${error}`);
      process.exit(1);
  }
  try {
    // Org2의 connectionProfile 가져오기
    const ccpPath = path.resolve(process.cwd(), '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // CA와 상호작용하는 CA client 생성
    const caInfo = ccp.certificateAuthorities['ca.org2.example.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

    // Org2의 wallet 생성
    const walletPath = path.join(process.cwd(), 'walletOrg2');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // admin 있는지 확인
    const identity = await wallet.get('admin');
    if (identity) {
        console.log('An identity for the ORG2 admin user "admin" already exists in the wallet');
        return;
    }

    // enroll admin
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
    };
    await wallet.put('admin', x509Identity);
    console.log('Successfully enrolled ORG2 admin user "admin" and imported it into the wallet');

} catch (error) {
    console.error(`Failed to enroll ORG2 admin user "admin": ${error}`);
    process.exit(1);
}
  
}

main();