### Lab 1: SDK
## Install the dependencies
Execute `npm install` from the sdk-and-chaincode directory to install all the node modules.  

## Start the network
> When we run `npm run startHLF`, it goes into the
network folder and runs `docker-compose up`. This brings up the blockchain network and sets up the Orderer, two Peers for each Org, two Certificate Authorities
and a couchDB for each peer.

+ !! For now, do not install node modules in the chaincode folder.
+ Start the blockchain with `npm run startHLF`
+ Check if all containers are up and running: use ___Kitematic___ (or, if you don't have it, `docker ps -a`).

**Note:** If you ever stop the network do `npm run tearDownHLF` to make sure there are no old containers left. Not starting with a clean slate can lead to hard to find bugs.

## Start the application
+ Once the network is up and running, you can start the application by executing: `npm run startApp` (or `node index.js`).

**Note:** If the application seems to hang at the 'install chaincode' step, this may be because you have a node_modules directory in the chaincode dir. Remove it and restart the app.

> When we run node index.js, the app will run `start()` which will first initialize the client. It then creates a
channel, (if it doesn't exist yet) which it will then join as long as its the first run of the application. After the
channel is initialized, the chaincode will be installed. When the installation is successful, we can start with a ___query___ or ___invoke___.

So, step by step:  
1. Initialize client
2. Create channel
3. Join channel with the peers (**of our organization**)
4. Install chaincode on the peers (**of our organization**)
5. Initialize the chaincode on the channel
6. Start doing invokes, queries

Take a look at the code, starting at `app.ts` and drilling down into `chaincode-wrapper.ts` and `channel-wrapper.ts`, and see if you can identify these steps. The code in this application is written by us and uses the SDK to interact with the network.

> Notice that we can only join a channel and install chaincode as our own organization (Org1MSP). 

You may see an error in your console in yellow: `This means the peer has not joined the channel yet`.  

To be able to do these actions as the other organizations, we need to change our identity.

Go to `app.ts` and change the '1' in the CONFIG_PATH to '2'. We now use configuration file that contains the details of Org2MSP.  

> Bonus: check out the config files to see how much the SDK can actually take in. This makes our lives a lot easier!

## Create query function
+ Add getMarblesByRange as the functionName for your query in the `app.ts` file (see `chaincode/marbles_chaincode.js` for all the queries).

> You can find the query function with its parameters in `chaincode.ts`

+ Run the application. It should show an empty array in the dev-Org2MSP container since no marble is added.
You can view the logs in the dev-Org1MSP container in ___Kitematic___.

Also view the logs in console by adding:

    console.log(payload);

to `app.ts`.

*If you replace getMarblesByRange by readMarble with a specific marble name, you should get an error instead of an empty array since no Marble with this name exists*

> CouchDB is a database management system.
It speaks JSON natively and supports binary for all your data storage needs. It's good for chaincode because it provides query functionality and makes it easier to do analytics.

## Create invoke function
+ To be able to retrieve a marble, a Marble first needs to be added to state. This can be done with an invoke.

> You can find the place where we call the invoke function in `chaincode-wrapper.ts`. It is similar to your previously used query function.

> initMarble - Creates a new marble

> It starts the initialization, then checks if a marble already exists.
If a marble doesn't exist, it creates the marble object and converts it to JSON.
It then saves the marble to state. You can then retrieve the marble with a query function.

+ Invoke the function that adds your Marble

> The name of the invoke function can be found in `chaincode/marbles_chaincode.js`

However, it seems that the invoke function that we have in our `chaincode-wrapper.ts` is not functioning properly. Something is missing.

> A fully functioning invoke function consists of the following:
>  + Build request
>  + Send the transaction proposal to the endorsers so they can simulate the invoke
>  + Keep the payload (return value) of the simulation to return after transaction is sent
>  + Send the responses to the ordering service so it can carve a block and send the results to the committers
>  + return payload

In order to create a fully functioning invoke function, build:
+ Chaincode invoke request (hint: see query function)
+ Create a broadcastResponse, which is sent by sendTransaction

> Hint: take a look at the instantiateOrUpgradeChaincode function

## Show that marbles are returning

When you have added the invoke function and initMarble is working properly, you should be able to get a marble with the following function:

```typescript
    let payload = await chaincode.query('readMarble', ['marble007']);
    console.log(payload);
```