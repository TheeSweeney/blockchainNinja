## Readme  
This is a minimal implementation of a TypeScript NodeJS app using the fabric-client. 

First, start the blockchain with `npm run startHLF`.

Run the app with `npm run startApp` or `node index.js`. It calls `app.ts`, which ties everything together. This allow us to use TypeScript without transpiling as a separate build step.  

The app instantiates an instance of the client sdk, which gets its settings from `network/network.localhost.org1.yaml`. Then it uses 
the ChannelWrapper (`channel-wrapper.ts`) to create and join a channel. ChaincodeWrapper (`chaincode-wrapper.ts`) provides a wrapper to 
common chaincode functions like install, instantiate, upgrade and of course invoke and query.
