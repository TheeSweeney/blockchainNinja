import * as fs from 'fs';
import * as path from 'path';
import Client = require('fabric-client');
import {Helper} from './helper';

export class ChannelWrapper {
  private helper = new Helper();

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
    }
  }

  public get channel(): Channel {
    return (this.client as any).getChannel('mychannel2');
  }

  public async create(): Promise<void> {
    const envelope_bytes = fs.readFileSync(path.join(__dirname, 'test/fixtures/channel/mychannel2.tx'));
    const config =  this.client.extractChannelConfig(envelope_bytes);
    const signatures = [this.client.signChannelConfig(config)];
    console.log('Signed channel configuration');

    const request = {
      config,
      signatures,
      name : 'mychannel2',
      orderer : 'orderer.example.com',
      txId  : (this.client as any).newTransactionID(true)
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
    const channel = this.channel;

    let proposal: JoinChannelRequest = {
      targets: channel.getPeers(), // TODO: remove?
      block: await channel.getGenesisBlock({txId: (this.client as any).newTransactionID()}),
      txId: (this.client as any).newTransactionID(true)
    };

    const response: any = await this.channel.joinChannel(proposal);
    console.log('Join channel:', response[0].message || response[0].response.message);
  }
}