import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Big from 'big.js'; // Import big.js for big number handling
import FtsoV2FeedConsumerABI from './ABI/FtsoV2FeedConsumer.json'; // Adjust the path as necessary

const FlareFeedConsumer = () => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [feedValues, setFeedValues] = useState([]);
  const [decimals, setDecimals] = useState([]);
  const [timestamp, setTimestamp] = useState(null);

  const contractAddress = "0xF7bA1f45aFC2937DdADBAcE862144D0a8e6732aC"; // Replace with your deployed contract address
  const abi = FtsoV2FeedConsumerABI.abi; // Use the ABI from the JSON file

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        setContract(contract);
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      console.error("No Ethereum provider found. Install MetaMask.");
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  const fetchFeedValues = async () => {
    if (contract) {
      try {
        const [rawFeedValues, decimals, timestamp] = await contract.getFtsoV2CurrentFeedValues();

        // Format the feed values using the provided decimals
        const formattedFeedValues = rawFeedValues.map((value, index) => {
          const divisor = Big(10).pow(decimals[index]);
          return Big(value.toString()).div(divisor).toString();
        });

        setFeedValues(formattedFeedValues);
        setDecimals(decimals);
        setTimestamp(new Date(timestamp.toNumber() * 1000).toLocaleString());
      } catch (error) {
        console.error("Error fetching feed values:", error);
      }
    }
  };

  return (
    <div>
      <h1>Flare Feed Consumer</h1>
      <button onClick={fetchFeedValues}>Fetch Feed Values</button>
      <div>
        <h2>Feed Values</h2>
        {feedValues.map((value, index) => (
          <div key={index}>
            Value: {value} (Decimals: {decimals[index]})
          </div>
        ))}
        <div>Timestamp: {timestamp}</div>
      </div>
    </div>
  );
};

export default FlareFeedConsumer;
