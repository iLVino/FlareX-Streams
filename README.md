

# FlareX Feeds

FlareX Feeds is a decentralized application (dApp) built on the Flare Network, designed to consume and utilize price feeds from the Flare Time Series Oracle (FTSOv2) in a cross-chain environment. By integrating LayerZero, our project enables seamless and secure communication of these price feeds across different blockchain networks, unlocking new possibilities for decentralized finance (DeFi) applications.

## Features

- **Decentralized Price Feeds**: Utilizes FTSOv2 to fetch real-time price feeds for various assets such as FLR/USD, BTC/USD, and ETH/USD.
- **Cross-Chain Integration with LayerZero**: Enables the transmission of price feed data to other chains, facilitating cross-chain DeFi applications.
- **User-Friendly Interface**: A simple front-end interface built with React and ethers.js, allowing users to connect their wallets, fetch price feed data, and send messages across chains.
- **Secure and Scalable**: Ensures secure communication of data through LayerZero’s endpoint and receiver interfaces.

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Smart Contract](#smart-contract)
5. [Front-End Application](#front-end-application)
6. [Deployment](#deployment)
7. [License](#license)

## Technologies Used

- **Solidity**: For writing the smart contract.
- **Foundry**: For developing and testing the smart contract.
- **React**: For building the front-end application.
- **ethers.js**: For interacting with the Ethereum blockchain.
- **LayerZero**: For cross-chain communication.
- **Material-UI**: For enhancing the UI/UX of the application.

## Installation

### Prerequisites

- Node.js and npm
- MetaMask (or any other Ethereum wallet)
- Foundry

### Clone the Repository

```bash
git clone https://github.com/yourusername/FlareX-Feeds.git
cd FlareX-Feeds
```

### Install Dependencies

```bash
npm install
```

### Install Foundry Dependencies

```bash
forge install
```

## Usage

### Connecting Wallet

- Open the application in your browser.
- Click on the "Connect Wallet" button.
- Follow the instructions to connect your MetaMask wallet.

### Fetching Feed Values

- Click on the "Fetch Feed Values" button to get the latest price feeds from FTSOv2.

### Cross-Chain Swap

- Select the asset pair from the dropdown menu.
- Enter the amount to swap.
- Enter the payload (e.g., destination address).
- Select the destination chain ID.
- Click on "Send LayerZero Message" to initiate the cross-chain swap.

## Smart Contract

The `FtsoV2FeedConsumer` smart contract interacts with FTSOv2 to fetch price feed data and uses LayerZero for cross-chain messaging.
Deployed address : 0xF7bA1f45aFC2937DdADBAcE862144D0a8e6732aC
                 : 0x79A7D7cF40945596896E9E89143fbecbeDCA3220
                 : 0x24f219695Ba0978DB36a3f22F7299533bbc5b2dd
                 : 0x367ca4cCDE4d6a3f5EE63B8843A80A1B0Bd107cC
                 : 0x49d1F9f16B431D8DD8cE2E233f145F706C293753


### Contract Source

`src/FtsoV2FeedConsumer.sol`

### Key Functions

- `getFtsoV2CurrentFeedValues()`: Fetches the current price feed values from FTSOv2.
- `lzReceive()`: Handles incoming messages from LayerZero.
- `sendMessage()`: Sends a cross-chain message using LayerZero.
- `estimateFees()`: Estimates the fees for sending a cross-chain message.

## Front-End Application

The front-end application is built using React and ethers.js, providing a user-friendly interface for interacting with the smart contract.

### Key Components

- **AppBar and Toolbar**: Navigation bar with title and wallet connection status.
- **Feed Values**: Displays the latest price feeds.
- **Cross-Chain Swap**: Interface for initiating cross-chain swaps.

### Key Files

- `src/FlareFeedConsumer.js`: Main component for the front-end application.
- `src/ABI/FtsoV2FeedConsumer.json`: ABI for the smart contract.

## Deployment

### Deploying the Smart Contract

1. **Compile and Deploy the Contract**:

```bash
forge build
source .env
forge script script/DeployFtsoV2FeedConsumer.s.sol --rpc-url https://coston-api.flare.network/ext/C/rpc --private-key $PRIVATE_KEY --broadcast
```

2. **Update the Front-End**:
   - Ensure your front end is connected to the deployed smart contract and update the contract address if necessary.

### Running the Application

1. **Start the Application**:

```bash
npm start
```

2. **Open in Browser**:
   - Open your browser and navigate to `http://localhost:3000` to view the application.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

By following this README, you should be able to set up, deploy, and use the FlareX Feeds project. If you have any questions or need further assistance, please feel free to reach out!

[`Use this Template`](https://github.com/new?owner=pancakeswap&template_name=pancake-v4-hooks-template&template_owner=pancakeswap)

## Prerequisite

1. Install foundry, see https://book.getfoundry.sh/getting-started/installation

## Running test

1. Install dependencies with `forge install`
2. Run test with `forge test --fork-url https://coston2-api.flare.network/ext/C/rpc`
3. Deploy with  `forge script script/DeployFtsoV2FeedConsumer.s.sol --rpc-url https://coston2-api.flare.network/ext/C/rpc --private-key $PRIVATE_KEY --broadcast`


## Description

This repository contains example counter hook for both CL and Bin pool types. 


