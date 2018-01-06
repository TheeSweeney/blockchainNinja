import Client = require('fabric-client');
import {BasicChaincodeInfo, ChaincodeWrapper} from './chaincode-wrapper';
import {ChannelWrapper} from './channel-wrapper';
import {Helper} from './helper';
import * as path from 'path';

const CONFIG_PATH = 'network/network.localhost.org2.yaml';

class App {
  private helper = new Helper();

  /**
   * The main function of our application. It runs when we start the app with 'node index.js'.
   * */
  public async start(): Promise<any> {
    const client = await this.initializeClient();

    // Create and join channel, make a local representation for the sdk
    const channelWrapper = new ChannelWrapper(client);
    await channelWrapper.initialize(true);

    // Update the version number to deploy
    const mychaincode: BasicChaincodeInfo = {
      chaincodeVersion: '2',
      chaincodeId: 'mychaincode',
      chaincodePath: path.join(__dirname, 'chaincode', 'javascript'),
      chaincodeType: 'node' as ChaicodeType // Node not yet supported in the types file
    };

    // Install and instantiate chaincode
    const chaincode = new ChaincodeWrapper(client, channelWrapper.channel, mychaincode);
    await chaincode.initialize();

    // We can access the invoke and query functions via the Chaincode wrapper.
    // make sure to await the result, since it's an asynchronous function.

    // 2. Initialize the marble here
    let payload = await chaincode.invoke('initMarble', ['marble1', 'blue', '35', 'tom']);
    console.log(payload);

    // We wait for the invoke to be completed. Normally you'd use events for this,
    // but we'll save that for some other time.
    await this.helper.sleep(8000);

    // 1. Get marbles by range
    payload = await chaincode.query('getMarblesByRange', ['', '']);
    console.log(payload);

    payload = await chaincode.query('readMarble', ['marble1']);
    console.log(payload);

    // Lab 2
    payload = await chaincode.query('queryMarblesByColor', ['blue']);
    console.log('\nThe result of the query queryMarblesByColor is: ', payload, '\n');

    payload = await chaincode.invoke('paintMarble', ['marble1', 'green']);
    console.log('\nThe result of the query paintMarble is: ', payload, '\n');

    await this.helper.sleep(8000);

    payload = await chaincode.query('readMarble', ['marble1']);
    console.log('\nThe result of the query readMarble is: ', payload, '\n');
  }

  /**
   * This prepares the fabric-client sdk by loading the configuration, initializing the credential stores and
   * Setting the user context to an admin user.
   */
  private async initializeClient(): Promise<Client> {
    const client = (Client as any).loadFromConfig(CONFIG_PATH);
    await client.initCredentialStores();
    await client.setUserContext({username: 'admin', password: 'adminpw'});

    return client;
  }
}

new App().start().catch((err: Error) => {
  console.error('Uncaught error:', err);
});