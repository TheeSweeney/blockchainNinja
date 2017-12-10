
##To upgrade
copy the full directory from github: `hyperledger/fabric-sdk-node/master/test/fixtures`

change grpcOptions to httpOptions and disable verification:
```json 
"ca-org1":{
  "url":"https://localhost:7054",
  "httpOptions":{
    "verify":false
  },
```