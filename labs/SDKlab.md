### SDK Lab
## Setup the network
+ Run npm install (npm install --save-dev @types/node if necessary)
+ !! For now, do not install node modules in the chaincode folder since this will break the application
+ Start the blockchain with `npm run startHLF`
+ Check if all containers are up and running: use `Kitematic`

## Start the application
+ Start the application by executing: `node index.js`

## Create query function
+ Add getMarblesByRange as the functionName for your query in the `app.ts` file (see `chaincode/marbles_chaincode.js` for all the queries)

> You can find the query function with its parameters in `chaincode.ts`

Run the application. It should return an empty array in the dev-Org2MSP container since no marble is added.
You can view the logs in the dev-Org2MSP container in Kitematic

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

## Show that marbles are returning

When you have added the invoke function and initMarble is working properly, you should be able to get a marble with the following function:

```javascript
    let payload = await chaincode.query('readMarble', ['marble007']);
    console.log(payload);
```