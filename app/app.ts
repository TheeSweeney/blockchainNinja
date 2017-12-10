import Client = require('fabric-client');
import {Chaincode} from './chaincode';
import {ChannelWrapper} from './channel-wrapper';

class App {

    public async go(): Promise<any> {
        const client = await this.initializeClient();

        const channelWrapper = new ChannelWrapper(client);
        await channelWrapper.initialize();

        const chaincode = new Chaincode(client, channelWrapper.channel);
        await chaincode.initialize();

        const payload = await chaincode.invoke(client, channelWrapper.channel, 'initMarble', ['marble2','blue','35','tom']);
        console.log(payload);
    }

    private async initializeClient(): Promise<Client> {
        const client = (Client as any).loadFromConfig('test/fixtures/network.yaml');
        await client.initCredentialStores();
        await client.setUserContext({username:'admin', password:'adminpw'});

        return client;
    }
}

new App().go().catch((err: Error) => {
    console.error('Uncaught error:', err);
});