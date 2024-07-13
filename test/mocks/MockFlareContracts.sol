// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IFlareContractRegistry} from "lib/flare-foundry-periphery-package/src/coston2/util-contracts/userInterfaces/IFlareContractRegistry.sol";
import {IFastUpdater} from "lib/flare-foundry-periphery-package/src/coston2/util-contracts/userInterfaces/IFastUpdater.sol";

contract MockFlareContractRegistry is IFlareContractRegistry {
    mapping(string => address) public mockAddresses;

    function setMockAddress(string memory name, address addr) public {
        mockAddresses[name] = addr;
    }

    function getContractAddressByName(string memory name) external view override returns (address) {
        return mockAddresses[name];
    }

    function getContractAddressByHash(bytes32 _nameHash) external view override returns (address) {}

    function getContractAddressesByName(string[] calldata _names) external view override returns (address[] memory) {}

    function getContractAddressesByHash(
        bytes32[] calldata _nameHashes
    ) external view override returns (address[] memory) {}

    function getAllContracts() external view override returns (string[] memory _names, address[] memory _addresses) {}
}

contract MockFastUpdater is IFastUpdater {
    function fetchCurrentFeeds(
        uint256[] memory feedIndexes
    ) external view override returns (uint256[] memory feedValues, int8[] memory decimals, uint64 timestamp) {
        feedValues = new uint256[](feedIndexes.length);
        decimals = new int8[](feedIndexes.length);
        timestamp = uint64(block.timestamp);

        for (uint i = 0; i < feedIndexes.length; i++) {
            feedValues[i] = feedIndexes[i] * 1000; // Mock values
            decimals[i] = 18;
        }
    }

    function submitUpdates(FastUpdates calldata _updates) external override {}

    function fetchAllCurrentFeeds()
        external
        view
        override
        returns (bytes21[] memory _feedIds, uint256[] memory _feeds, int8[] memory _decimals, uint64 _timestamp)
    {}

    function currentScoreCutoff() external view override returns (uint256 _cutoff) {}

    function blockScoreCutoff(uint256 _blockNum) external view override returns (uint256 _cutoff) {}

    function currentSortitionWeight(address _signingPolicyAddress) external view override returns (uint256 _weight) {}

    function submissionWindow() external view override returns (uint8) {}

    function currentRewardEpochId() external view override returns (uint24) {}

    function numberOfUpdates(uint256 _historySize) external view override returns (uint256[] memory _noOfUpdates) {}

    function numberOfUpdatesInBlock(uint256 _blockNumber) external view override returns (uint256 _noOfUpdates) {}
}