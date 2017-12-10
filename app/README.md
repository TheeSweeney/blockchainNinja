## Readme  
This is a minimal implementation of a TypeScript NodeJS app using the fabric-client. 

First, start the blockchain with `npm run startHLF`.

Run the app with `node index.js`. It calls `app.ts`, which ties everything together. This allow us to use TypeScript without transpiling as a separate build step.  

The app instantiates an instance of the client sdk, which gets its settings from `test/fixtures/network.yaml`. Then it uses 
the ChannelWrapper (`channel-wrapper.ts`) to create and join a channel. Chaincode (`chaincode.ts`) provides a wrapper to 
common chaincode functions like install, instantiate, upgrade and of course invoke and query.

## Origins  
The full test directory comes from from github: `hyperledger/fabric-sdk-node/master/test/fixtures` (which is where we should go to update this). The app is created by CIC Benelux.