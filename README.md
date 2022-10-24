## Distributed-File-system-using-blockchain

Hyperledger Fabric v2.2의 fabric-samples를 받고 git clone

cd fabric-samples/test-network

./network up -ca -s couchdb

./network createChannel

./network.sh deployCC -ccn file -ccp ../Distributed-File-system-using-blockchain/chaincode -ccl javascript

cd fabric-samples/Distributed-File-system-using-blockchain/backend

node enrollment.js

node registerUser.js
```bash
├── walletOrg1
│   ├── Org1AppUser.id
│   └── admin.id
└── walletOrg2
    ├── Org2AppUser.id
    └── admin.id
```

frontend의 main.js 파일에서 socket io(ip 변경), api.js에서 baseURL 변경

frontend와 backend에서 npm install

backend는 npm start
frontend는 yarn electron:serve


결과
![image](https://user-images.githubusercontent.com/50129757/197471742-3be045af-a74d-4d2e-b01a-0acc23accf73.png)



