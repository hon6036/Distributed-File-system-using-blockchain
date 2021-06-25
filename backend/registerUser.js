/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // Org1의 connectionProfile 가져오기
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // CA와 상호작용하는 CA client 생성
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Org1의 wallet 생성
        const walletPath = path.join(process.cwd(), 'walletOrg1');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Org1AppUser 있는지 확인
        const userIdentity = await wallet.get('Org1AppUser');
        if (userIdentity) {
            console.log('An identity for the user "Org1AppUser" already exists in the wallet');
            return;
        }

        // admin이 있는지 확인
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('An identity for the Org1 admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // CA로 인증할 수 있는 사용자 개체 생성
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // user register, enroll 후 wallet에 import
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: 'Org1AppUser',
            role: 'client'
        }, adminUser);
        const enrollment = await ca.enroll({
            enrollmentID: 'Org1AppUser',
            enrollmentSecret: secret
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put('Org1AppUser', x509Identity);
        console.log('Successfully registered and enrolled Org1 admin user "appUser" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to register Org1 user "Org1AppUser": ${error}`);
        process.exit(1);
    }
    try {
        // Org2의 connectionProfile 가져오기
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // CA와 상호작용하는 CA client 생성
        const caURL = ccp.certificateAuthorities['ca.org2.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Org2의 wallet 생성
        const walletPath = path.join(process.cwd(), 'walletOrg2');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // appUser 있는지 확인
        const userIdentity = await wallet.get('Org2AppUser');
        if (userIdentity) {
            console.log('An identity for the Org2 user "Org2AppUser" already exists in the wallet');
            return;
        }

        // admin이 있는지 확인
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('An identity for the Org2 admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // CA로 인증할 수 있는 사용자 개체 생성
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // user register, enroll 후 wallet에 import
        const secret = await ca.register({
            affiliation: 'org2.department1',
            enrollmentID: 'Org2AppUser',
            role: 'client'
        }, adminUser);
        const enrollment = await ca.enroll({
            enrollmentID: 'Org2AppUser',
            enrollmentSecret: secret
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put('Org2AppUser', x509Identity);
        console.log('Successfully registered and enrolled Org2 admin user "Org2AppUser" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to register Org2 user "Org2AppUser": ${error}`);
        process.exit(1);
    }    
}

main();
