// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/FlareFeeds.sol";
import {MockFlareContractRegistry, MockFastUpdater} from "./mocks/MockFlareContracts.sol";

contract FtsoV2FeedConsumerTest is Test {
    FtsoV2FeedConsumer consumer;
    MockFlareContractRegistry mockRegistry;
    MockFastUpdater mockFastUpdater;

    address flareContractRegistryAddress = 0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019;

    function setUp() public {
        mockRegistry = new MockFlareContractRegistry();
        mockFastUpdater = new MockFastUpdater();

        // Set the address in the mock registry
        mockRegistry.setMockAddress("FastUpdater", address(mockFastUpdater));

        // Initialize the consumer with the mock registry address
        consumer = new FtsoV2FeedConsumer();
    }

    function testGetFtsoV2CurrentFeedValues() public {
        (uint256[] memory feedValues, int8[] memory decimals, uint64 timestamp) = consumer.getFtsoV2CurrentFeedValues();

        // Add your assertions here
        assertEq(feedValues.length, 5);
        assertEq(decimals.length, 5);
        assertTrue(timestamp > 0);
    }
}
