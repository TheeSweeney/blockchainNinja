import Client = require('fabric-client');
import * as path from 'path';
import {Helper} from './helper';

const CHAINCODE = {
  chaincodeId: 'mychaincode',
  chaincodeVersion: '1.6',
  chaincodeType: 'node'
};

export class Chaincode {
  private helper = new Helper();

  public constructor(private client: Client, private channel: Channel) {

  }

  public async initialize(): Promise<any> {
    const res = await (this.channel as any).queryInstantiatedChaincodes(this.channel.getPeers()[0], true);
    const instantiatedChaincode: ChaincodeInfo | undefined = res.chaincodes.find((cc: ChaincodeInfo) => cc.name === CHAINCODE.chaincodeId);

    if (instantiatedChaincode && instantiatedChaincode.version === CHAINCODE.chaincodeVersion) {
      console.log('Chaincode is up to date.');

      return;
    }

    await this.install();

    if (instantiatedChaincode) {
      await this.upgrade();
    } else {
      await this.instantiate();
    }
  }

  public async install(): Promise<void> {
    const request: ChaincodeInstallRequest | any = {
      chaincodePath: path.join(__dirname, 'chaincode'),
      ...CHAINCODE
    };

    const response = await this.client.installChaincode(request);
    console.log('Install chaincode:', (response[0][0] as any).message || response[0][0].response.status);
  }

  public async instantiate(): Promise<any> {
    return this.instantiateOrUpgradeChaincode('instantiate');
  }

  public async upgrade(): Promise<any> {
    return this.instantiateOrUpgradeChaincode('upgrade');
  }

  public async invoke(client: any, channel: Channel, fcn: string, args: string[]): Promise<any> {
    const req = {
      txId: client.newTransactionID(true),
      chaincodeId: CHAINCODE.chaincodeId,
      fcn,
      args
    };

    console.log('Sending invoke');
    const res = await channel.sendTransactionProposal(req);
    console.log('Invoke:', (res[0][0] as any).message || res[0][0].response.status);

    return res[0][0].response.payload.toString();
  }

  private async instantiateOrUpgradeChaincode(instantiateOrUpgrade: 'instantiate' | 'upgrade'): Promise<any> {
    const proposal: ChaincodeInstantiateUpgradeRequest = {
      txId: (this.client as any).newTransactionID(true),
      ...CHAINCODE
    };

    let response: ProposalResponseObject;
    if (instantiateOrUpgrade === 'instantiate') {
      response = await this.channel.sendInstantiateProposal(proposal);
    } else {
      response = await (this.channel as any).sendUpgradeProposal(proposal);
    }

    let error = (response[0][0] as any).message;
    if (error) {
      console.log(`Chaincode ${instantiateOrUpgrade}`, error);

      return;
    }

    console.log(`Chaincode ${instantiateOrUpgrade}`, response[0][0].response.message);
    const res = await this.channel.sendTransaction(<any>{
      proposalResponses: response[0],
      proposal: response[1],
      txId: (this.client as any).newTransactionID(true)
    });

    console.log(`Chaincode ${instantiateOrUpgrade} broadcast:`, res.status);
    await this.helper.sleep(5000);
  }
}
