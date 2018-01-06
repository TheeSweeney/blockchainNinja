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

    // Lab 1 step 2. Initialize the marble here


    // We wait for the invoke to be completed. Normally you'd use events for this,
    // but we'll save that for some other time.
    await this.helper.sleep(8000);

    // Lab 1 step 1. Get marbles by range

    // Lab 2

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