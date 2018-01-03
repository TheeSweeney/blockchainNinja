### SDK Lab
## Setup the network
> Before we are able to setup the network, we first need to install all the node modules. Since this is done for you,
we do not have to run `npm install` to be able to run our network. When we run `npm run startHLF`, it goes into the
network folder and runs `docker-compose up`. This then deploys the network and sets up the Orderer, two Peers for each Org, two Certificate Authorities
and a couchDB for each peer.

+ !! For now, do not install node modules in the chaincode folder since this will break the application
+ Start the blockchain with `npm run startHLF`
+ Check if all containers are up and running: use ___Kitematic___

## Start the application
+ Once the network is up and running, you can start the application by executing: `node index.js`

> When we run node index.js, the app will run `start()` which will first initialize the client. It then creates a
channel, (if it doesn't exist yet) which it will then join as long as its the first run of the application. After the
channel is initialized, the chaincode will be installed. When the installation is successful, we can start with a ___query___ or ___invoke___.

## Create query function
+ Add getMarblesByRange as the functionName for your query in the `app.ts` file (see `chaincode/marbles_chaincode.js` for all the queries)

> You can find the query function with its parameters in `chaincode.ts`

Run the application. It should return an empty array in the dev-Org2MSP container since no marble is added.
You can view the logs in the dev-Org2MSP container in ___Kitematic___

Also view the logs in console by adding:

    console.log(payload);

to `app.ts`.

*If you replace getMarblesByRange by readMarble with a specific marble name, you should get an error instead of an empty array since no Marble with this name exists*

> Reminder CouchDB: CouchDB is a database management system. It safely stores data on your own servers or any leading cloud provider.
It speaks JSON natively and supports binary for all your data storage needs.

## Create invoke function
+ To be able to retrieve a marble, a Marble first needs to be added to state. This can be done with an invoke.

> You can find the invoke function in `chaincode.ts`. It is similar to your previously created query function.

> initMarble - Creates a new marble

> It starts the initialization, then checks if a marble already exists.
If a marble doesn't exist, it creates the marble object and marshals it to JSON.
It then saves the marble to state. You can then retrieve the marble with a query function.

+ Create an invoke function which adds your Marble

> The name of the invoke function can be found in `chaincode/marbles_chaincode.js`

+ However, it seems that the invoke function is not functioning properly. Create a functioning invoke.

> A fully functioning invoke function consists of the following:

> + Build request
  + Send the transaction proposal to the endorsers so they can simulate the invoke
  + Keep the payload (return value) of the simulation to return after transaction is sent
  + Send the responses to the ordering service so it can carve a block and send the results to the committers
  + return payload

In order to create a fully functioning invoke function, build:
+ Chaincode invoke request (hint: see query function)
+ Create a broadcastResponse, which is sent by sendTransaction

> hint: take a look at the instantiateOrUpgradeChaincode function

## Show that marbles are returning

When you have added the invoke function and initMarble is working properly, you should be able to get a marble with the following function:

```javascript
    let payload = await chaincode.query('readMarble', ['marble007']);
    console.log(payload);
```