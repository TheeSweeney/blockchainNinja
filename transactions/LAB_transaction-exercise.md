# **IBM Blockchain**


## Ninja Apprentice Course
*Lab – Transaction Exercise*

---

### *Contents:*
1. Overview
2. Roles
3. Set up the exercise

---

## Overview:    Introduction to the Lab
In this exercise you will perform transactions using a group of people. Everyone is given a specific role with its own instructions. The group will be functioning as an application that controls a traffic light on a blockchain. The clients can perform transactions to change the color of the light. There are a couple rules defined for these color changes; there are only 3 possible colors + there is a specific order in which the lights can change color. These are defined in the chaincode running on the endorsing peers.

---

## Roles
### ROLE: Clients
As a client you have different cards which you will pass to the SDK in order to perform them on the Blockchain network. These cards could have either a transaction or a query written on them. Your task is to send these cards to the SDK in order to query the network or perform a transaction.

**Transactions / Queries**
- Transaction: Change the color to green!
- Transaction: Change the color to red!
- Transaction: Change the color to orange!
- Transaction: Change the color to blue!
- Transaction: Change the color to purple!
- Query: What is the light color?

### ROLE: SDK
As the SDK your task is to receive cards from the client and send these to the right peers.

*Queries*

When you get a card with a query you have to give this to any of endorsing or committing peers and they'll return an answer that you can give to your client

*Transactions*

When the client gives you a card with a transaction your task is to deliver this transaction to all of the endorsing peers. When they give back a signed (valid) transaction you will give this to the orderers. If in the end a block is added to the blockchain, the peers will tell you and you can pass this on to the clients. If the transaction is not signed (invalid) you can throw it away and inform the client.

### ROLE: Endorsing Peers
As an endorsing peer you have multiple tasks:
- Check the validity of transactions
- Add new blocks to your ledger
- Handle incoming queries

#### Validating transactions
When you get a transaction from the SDK your task is to check whether the transaction is valid or not using the rules in the chaincode. If the transaction is valid you put your signature on it and pass it back to the SDK. If it's invalid you mark it with a cross and send it back to the SDK.

#### Add new blocks
When you get a new block from the endorser you can put it on top of your other blocks. The current traffic light color is the one that's written on the latest block.

#### Handle incoming queries
When you get a query from the SDK, your task is to write down the current color in your ledger on the card and pass it back to the SDK.

**Chaincode rules**
- Light can only be green, orange or red
- Light can only go from green -> orange -> red -> green
- Light can NOT go from red to orange, green to red or orange to green!


### ROLE: Committing Peers
As an committing peer you two multiple tasks:
- Add new blocks to your ledger
- Handle incoming queries

#### Add new blocks
When you get a new block from the endorser you can put it on top of your other blocks. The current light color is the one that's written on the latest block.

#### Handle incoming queries
When you get a query from the SDK, your task is to write down the current color in your ledger on the card and pass it back to the SDK.

### ROLE: Orderers
As the orderer service you will receive valid transactions from the SDK. Your task is to create identical blocks for all the peers (both endorsing and committing peers) with the new block number and the new status. You then give one of these blocks to each peer on the network.

---

## Set up the exercise
To set up the exercise print out the role descriptions seperately.

- 3 Endorser peers
- 2 Committing peers
- 1 SDK
- 2 Orderers
- X Clients

Write down the different queries and transactions on post-its and hand them out to the clients.
Write down the number one + "green" on post-its of a different color and give one of these to each of the peers, these are the blocks.
Give the orderers the same color post-its as used for the blocks, but leave them blank.
