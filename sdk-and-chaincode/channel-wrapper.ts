import * as fs from 'fs';
import * as path from 'path';
import Client = require('fabric-client');
import {Helper} from './helper';

export class ChannelWrapper {
  private helper = new Helper();
  private channelName = 'mychannel';

  public constructor(private client: Client) {}

  public async initialize(firstRun: boolean = true): Promise<any> {
    if (firstRun) {
      await this.create();
    } else {
      console.log('Assuming channel is already there (firstRun set to false).');
    }

    // Initialize the channel representation for the sdk.
    await this.channel.initialize();

    if (firstRun) {
      await this.join();
    } else {
      console.log('Assuming channel is already joined (firstRun set to false).');
    }
  }

  public get channel(): Channel {
    return this.client.getChannel(this.channelName);
  }

  public async create(): Promise<void> {
    const envelope_bytes = fs.readFileSync(path.join(__dirname, 'network/shared/channel-artifacts/channel.tx'));
    const config =  this.client.extractChannelConfig(envelope_bytes);
    const signatures = [this.client.signChannelConfig(config)];
    console.log('Signed channel configuration');

    const request: ChannelRequest = {
      config: config,
      signatures: signatures,
      name: this.channelName,
      orderer: this.channel.getOrderers()[0],
      txId: this.client.newTransactionID(true)
    };

    try {
      console.log('Sending create channel request to orderer');
      const response = await this.client.createChannel(request);

      console.log('Create channel', response.status);
      await this.helper.sleep(5000);
    } catch (error) {
      if (error.message === 'BAD_REQUEST') {
        console.log('Got error when trying to create channel. Already exists?');
      } else {
        throw error;
      }
    }
  }

  public async join(): Promise<void> {
    const genesisBlock = await this.channel.getGenesisBlock({
      txId: this.client.newTransactionID(),
      orderer: this.channel.getOrderers()[0]
    });

    let proposal: JoinChannelRequest = {
      targets: this.client.getPeersForOrg(''),
      block: genesisBlock,
      txId: this.client.newTransactionID(true)
    };

    const response: any = await this.channel.joinChannel(proposal);

    response.forEach((r: Error | any) => {
      const errorMessage = r.message;

      if (errorMessage) {
        if (errorMessage.indexOf('Cannot create ledger from genesis block, due to LedgerID already exists')) {
          console.log('Peer has already joined this channel.');
        } else if (errorMessage.indexOf('Failed to deserialize creator identity') > -1) {
          throw new Error(`Join channel error (are you referring to the right peer?) - ${errorMessage}`); // TODO check what this means
        }
      }
    });
  }
}