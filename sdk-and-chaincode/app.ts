import Client = require('fabric-client');
import {BasicChaincodeInfo, ChaincodeWrapper} from './chaincode-wrapper';
import {ChannelWrapper} from './channel-wrapper';
import {Helper} from './helper';

const CONFIG_PATH = 'network/network.localhost.org1.yaml';

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
      chaincodeVersion: '3',
      chaincodeId: 'mychaincode',
      chaincodeType: 'node' as ChaicodeType // Node not yet supported in the types file
    };

    // Install and instantiate chaincode
    const chaincode = new ChaincodeWrapper(client, channelWrapper.channel, mychaincode);
    await chaincode.initialize();

    // We can access the invoke and query functions via the Chaincode wrapper.
    let payload = await chaincode.query('readMarble', ['marble1']);
    console.log('\nThe result of the query readMarble is: ', payload, '\n');

    payload = await chaincode.invoke('initMarble', ['marble1', 'blue', '35', 'tom']);
    console.log('\nThe result of the invoke initMarble is: ', payload, '\n');

    await this.helper.sleep(8000);

    payload = await chaincode.query('readMarble', ['marble1']);
    console.log('\nThe result of the query readMarble is: ', payload, '\n');

    // solution for Calling queryMarblesByColor
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