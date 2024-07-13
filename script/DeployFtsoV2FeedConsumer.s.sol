// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/FlareFeeds.sol";

contract DeployFtsoV2FeedConsumer is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy the contract
        FtsoV2FeedConsumer feedConsumer = new FtsoV2FeedConsumer();

        // Log the address of the deployed contract
        console.log("FtsoV2FeedConsumer deployed to:", address(feedConsumer));

        vm.stopBroadcast();
    }
}
