// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import { IFlareContractRegistry } from "lib/flare-foundry-periphery-package/src/coston2/util-contracts/userInterfaces/IFlareContractRegistry.sol";
import { IFastUpdater } from "lib/flare-foundry-periphery-package/src/coston2/util-contracts/userInterfaces/IFastUpdater.sol";
import "lib/LayerZero/contracts/interfaces/ILayerZeroEndpoint.sol";
import "lib/LayerZero/contracts/interfaces/ILayerZeroReceiver.sol";

contract FtsoV2FeedConsumer is ILayerZeroReceiver {
    IFlareContractRegistry internal contractRegistry;
    IFastUpdater internal ftsoV2;
    ILayerZeroEndpoint public endpoint;
    uint256[] public feedIndexes = [0, 2, 9, 3, 5];

    struct MessagingFee {
        uint256 nativeFee;
        uint256 lzTokenFee;
    }

    constructor(address _endpoint) {
        require(_endpoint != address(0), "Invalid endpoint address");
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
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64 _nonce,
        bytes memory _payload
    ) external override {
        require(msg.sender == address(endpoint), "Only endpoint can call this function");

        // Emit an event for logging
        emit ReceivedMessage(_srcChainId, _srcAddress, _nonce, _payload);

        // Decode the payload and handle the received message
        // Example: decoding a string and uint256 from the payload
        (string memory message, uint256 value) = abi.decode(_payload, (string, uint256));

        // Log the decoded message and value
        emit DecodedMessage(message, value);

        // Handle the message (example logic)
        // Add your custom logic here
    }

    function send(
        uint16 _dstChainId,
        string memory _message,
        bytes calldata _options
    ) external payable {
        require(bytes(_message).length > 0, "Message cannot be empty");
        require(msg.value > 0, "Insufficient funds to send message");

        bytes memory _payload = abi.encode(_message);
        MessagingFee memory fees = MessagingFee(msg.value, 0);

        _lzSend(
            _dstChainId, // Destination chain's endpoint ID
            _payload,    // Encoded message payload
            _options,    // Message execution options
            fees,        // Fee struct containing native gas and ZRO token
            payable(msg.sender) // Refund address
        );
    }

    function _lzSend(
        uint16 _dstChainId,
        bytes memory _payload,
        bytes memory _options,
        MessagingFee memory fees,
        address payable _refundAddress
    ) internal {
        require(_dstChainId > 0, "Invalid destination chain ID");
        require(_payload.length > 0, "Payload cannot be empty");

        // Emit an event for logging
        emit SendingMessage(_dstChainId, _payload, _options);

        endpoint.send{value: fees.nativeFee}(
            _dstChainId,
            abi.encodePacked(address(this)),
            _payload,
            _refundAddress,
            address(0x0),
            _options
        );
    }

    function estimateFees(
        uint16 _dstChainId,
        bytes calldata _destination,
        bytes calldata _payload
    ) external view returns (uint256 nativeFee, uint256 zroFee) {
        return endpoint.estimateFees(_dstChainId, address(this), _payload, false, bytes(""));
    }

    // Fallback function to receive refunds
    receive() external payable {}

    // Events for logging
    event SendingMessage(uint16 indexed dstChainId, bytes payload, bytes options);
    event ReceivedMessage(uint16 indexed srcChainId, bytes indexed srcAddress, uint64 indexed nonce, bytes payload);
    event DecodedMessage(string message, uint256 value);
}
