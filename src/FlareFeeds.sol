// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {IFlareContractRegistry} from "lib/flare-foundry-periphery-package/src/coston2/util-contracts/userInterfaces/IFlareContractRegistry.sol";
import {IFastUpdater} from "lib/flare-foundry-periphery-package/src/coston2/util-contracts/userInterfaces/IFastUpdater.sol";
import "lib/LayerZero/contracts/interfaces/ILayerZeroEndpoint.sol";
import "lib/LayerZero/contracts/interfaces/ILayerZeroReceiver.sol";

contract FtsoV2FeedConsumer is ILayerZeroReceiver {
    IFlareContractRegistry internal contractRegistry;
    IFastUpdater internal ftsoV2;
    ILayerZeroEndpoint public endpoint;
    uint256[] public feedIndexes = [0, 2, 9, 3, 5];

    constructor(address _endpoint) {
        contractRegistry = IFlareContractRegistry(0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019);
        ftsoV2 = IFastUpdater(contractRegistry.getContractAddressByName("FastUpdater"));
        endpoint = ILayerZeroEndpoint(_endpoint);
    }

    function getFtsoV2CurrentFeedValues()
        external
        view
        returns (
            uint256[] memory _feedValues,
            int8[] memory _decimals,
            uint64 _timestamp
        )
    {
        (uint256[] memory feedValues, int8[] memory decimals, uint64 timestamp) = ftsoV2.fetchCurrentFeeds(feedIndexes);
        return (feedValues, decimals, timestamp);
    }

    function lzReceive(
        uint16 /*_srcChainId*/,
        bytes memory /*_srcAddress*/,
        uint64 /*_nonce*/,
        bytes memory /*_payload*/
    ) external       view
override {
        require(msg.sender == address(endpoint), "Only endpoint can call this function");
        // Add your logic to handle the received message
    }

    function sendMessage(
        uint16 _dstChainId,
        bytes calldata _destination,
        bytes calldata _payload
    ) external payable {
        endpoint.send{value: msg.value}(
            _dstChainId,            // destination chainId
            _destination,           // destination contract address
            _payload,               // abi.encode()'ed bytes
            payable(msg.sender),    // refund address (LayerZero will refund any excess message fee)
            address(0x0),           // 'zroPaymentAddress' unused for this example
            bytes("")               // 'adapterParams' unused for this example
        );
    }

    function estimateFees(
        uint16 _dstChainId,
        bytes calldata /*_destination*/,
        bytes calldata _payload
    ) external view returns (uint256 nativeFee, uint256 zroFee) {
        return endpoint.estimateFees(_dstChainId, address(this), _payload, false, bytes(""));
    }
}
