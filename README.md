## Distributed-File-system-using-blockchain

Hyperledger Fabric v2.2의 fabric-samples를 받고 git clone

cd fabric-samples/test-network

./network up -ca

./network createChannel

./network.sh deployCC -ccn file -ccp ../Distributed-File-system-using-blockchain/chaincode -ccl javascript

cd fabric-samples/Distributed-File-system-using-blockchain/backend

node enrollment.js

node registerUser.js

├── walletOrg1
│   ├── Org1AppUser.id
│   └── admin.id
└── walletOrg2
    ├── Org2AppUser.id
    └── admin.id
    



