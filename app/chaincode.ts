import Client = require('fabric-client');
import * as path from 'path';
import {Helper} from './helper';

export interface BasicChaincodeInfo {
  chaincodeId: string;
  chaincodeVersion: string;
  chaincodeType: ChaicodeType;
}

export class Chaincode {
  private helper = new Helper();

  public constructor(private client: Client, private channel: Channel, private basicChaincodeInfo: BasicChaincodeInfo) {
  }

  /**
   * If the chaincode is not instantiated yet, install it and instantiate.
   * If the version is different than the one passed to the constructor of this function, upgrade.
   */
  public async initialize(): Promise<any> {
    const res = await (this.channel as any).queryInstantiatedChaincodes(this.channel.getPeers()[0], true);
    const instantiatedChaincode: ChaincodeInfo | undefined = res.chaincodes.find((cc: ChaincodeInfo) => cc.name === this.basicChaincodeInfo.chaincodeId);

    if (instantiatedChaincode && instantiatedChaincode.version === this.basicChaincodeInfo.chaincodeVersion) {
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
    const request: ChaincodeInstallRequest = {
      targets: this.channel.getPeers(),
      chaincodePath: path.join(__dirname, 'chaincode'),
      ...this.basicChaincodeInfo // Take the fields from basicChaincodeInfo and add them to the request.
    };

    const res = await this.client.installChaincode(request);
    console.log('Install chaincode:', (res[0][0] as any).message || res[0][0].response.status);
  }

  public async invoke(fcn: string, args: string[]): Promise<any> {
    const prefix = `Invoke: ${fcn} ${args}`;

    const req = {
      txId: (this.client as any).newTransactionID(),
      chaincodeId: this.basicChaincodeInfo.chaincodeId,
      fcn,
      args
    };

    const res = await this.channel.sendTransactionProposal(req);
    let error = (res[0][0] as any).message;
    if (error) {
      console.log(`${prefix}. Error:`, error);

      return 'ERROR';
    } else {
      console.log(`${prefix}. Status:`, res[0][0].response.status);
    }

    return res[0][0].response.payload.toString();
  }

  public async query(fcn: string, args: string[]): Promise<string> {
    const prefix = `Query: ${fcn} ${args}`;

    const req = {
      txId: (this.client as any).newTransactionID(),
      chaincodeId: this.basicChaincodeInfo.chaincodeId,
      fcn,
      args
    };

    const res = await this.channel.sendTransactionProposal(req);
    let error = (res[0][0] as any).message;
    if (error) {
      console.log(`${prefix}. Error:`, error);

      return 'ERROR';
    } else {
       console.log(`${prefix}. Status:`, res[0][0].response.status);
    }
    
    return res[0][0].response.payload.toString();
  }

  public async instantiate(): Promise<any> {
    return this.instantiateOrUpgradeChaincode('instantiate');
  }

  public async upgrade(): Promise<any> {
    return this.instantiateOrUpgradeChaincode('upgrade');
  }

  private async instantiateOrUpgradeChaincode(instantiateOrUpgrade: 'instantiate' | 'upgrade'): Promise<any> {
    const proposal: ChaincodeInstantiateUpgradeRequest = {
      txId: (this.client as any).newTransactionID(true),
      ...this.basicChaincodeInfo // Take the fields from basicChaincodeInfo and add them to the request.
    };

    let res: ProposalResponseObject;
    if (instantiateOrUpgrade === 'instantiate') {
      res = await this.channel.sendInstantiateProposal(proposal);
    } else {
      res = await (this.channel as any).sendUpgradeProposal(proposal);
    }

    let error = (res[0][0] as any).message;
    if (error) {
      console.log(`Chaincode ${instantiateOrUpgrade}`, error);

      return;
    }

    console.log(`Chaincode ${instantiateOrUpgrade}`, res[0][0].response.message);
    const broadcastResponse = await this.channel.sendTransaction(<any>{
      proposalResponses: res[0],
      proposal: res[1],
      txId: (this.client as any).newTransactionID(true)
    });

    console.log(`Chaincode ${instantiateOrUpgrade} broadcast:`, broadcastResponse.status);
    await this.helper.sleep(10000);
  }
}
