import Client = require('fabric-client');
import {BasicChaincodeInfo, Chaincode} from './chaincode';
import {ChannelWrapper} from './channel-wrapper';
import {Helper} from './helper';

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
            chaincodeVersion: '3',
            chaincodeId: 'mychaincode',
            chaincodeType: 'node' as ChaicodeType // Node not yet supported in the types file
        };

        // Install and instantiate chaincode
        const chaincode = new Chaincode(client, channelWrapper.channel, mychaincode);
        await chaincode.initialize();

        // We can access the invoke and query functions via the Chaincode wrapper.
        let payload = await chaincode.query('readMarble', ['marble1']);
        console.log(payload);

        payload = await chaincode.invoke('initMarble', ['marble1','blue','35','tom']);
        console.log(payload);

        await this.helper.sleep(8000);

        payload = await chaincode.query('readMarble', ['marble1']);
        console.log(payload);
    }

    /**
     * This prepares the fabric-client sdk by loading the configuration, initializing the credential stores and
     * Setting the user context to an admin user.
     */
    private async initializeClient(): Promise<Client> {
        const client = (Client as any).loadFromConfig(CONFIG_PATH);
        await client.initCredentialStores();
        await client.setUserContext({username:'admin', password:'adminpw'});

        return client;
    }
}

new App().start().catch((err: Error) => {
    console.error('Uncaught error:', err);
});