// 0x71abD4a0A96133978e3C0C6f09144A441b895F31

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Big from 'big.js';
import FtsoV2FeedConsumerABI from './ABI/FtsoV2FeedConsumer.json';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FlareFeedConsumer = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [feedValues, setFeedValues] = useState([]);
  const [timestamp, setTimestamp] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [dstChainId, setDstChainId] = useState(10002); // Example destination chain ID
  const [destination, setDestination] = useState("0x..."); // Destination address on the destination chain
  const [swapAmount, setSwapAmount] = useState("");
  const [swapPayload, setSwapPayload] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);

  const contractAddress = "0xF7bA1f45aFC2937DdADBAcE862144D0a8e6732aC"; // Replace with your deployed contract address
  const abi = FtsoV2FeedConsumerABI.abi;
  const assetPairs = ["FLR/USD", "BTC/USD", "ETH/USD", "Pair 3", "Pair 5"]; // Add or modify as needed

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setProvider(provider);
        setSigner(signer);
        setWalletConnected(true);
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

        const formattedFeedValues = rawFeedValues.map((value, index) => {
          const divisor = Big(10).pow(decimals[index]);
          return Big(value.toString()).div(divisor).toFixed(2); // Format to 2 decimal places
        });

        setFeedValues(formattedFeedValues);
        setTimestamp(new Date(timestamp.toNumber() * 1000).toLocaleString());

        // Mock historical data
        setHistoricalData([
          { name: 'Page A', value: 4000 },
          { name: 'Page B', value: 3000 },
          { name: 'Page C', value: 2000 },
          { name: 'Page D', value: 2780 },
          { name: 'Page E', value: 1890 },
          { name: 'Page F', value: 2390 },
          { name: 'Page G', value: 3490 },
        ]);
      } catch (error) {
        console.error("Error fetching feed values:", error);
      }
    }
  };

  const sendMessage = async () => {
    if (contract) {
      try {
        const payload = ethers.utils.defaultAbiCoder.encode(
          ["string"],
          [swapPayload]
        );
        const fees = await contract.estimateFees(dstChainId, destination, payload);
        await contract.sendMessage(dstChainId, destination, payload, { value: fees[0] });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleSwapAmountChange = (e) => {
    setSwapAmount(e.target.value);
  };

  const handleSwapPayloadChange = (e) => {
    setSwapPayload(e.target.value);
  };

  const handleDstChainIdChange = (e) => {
    setDstChainId(e.target.value);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            FlareX Feeds
          </Typography>
          <Button color="inherit" onClick={connectWallet}>
            {walletConnected ? "Wallet Connected" : "Connect Wallet"}
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        {walletConnected && (
          <>
            <Grid container spacing={3} style={{ marginTop: 20 }}>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={fetchFeedValues}>
                  Fetch Feed Values
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Feed Values
                    </Typography>
                    {feedValues.map((value, index) => (
                      <Typography key={index} variant="body2">
                        {assetPairs[index]}: ${value}
                      </Typography>
                    ))}
                    <Typography variant="body2">
                      Timestamp: {timestamp}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Cross-Chain Swap
                    </Typography>
                    <FormControl fullWidth margin="normal">
                      <TextField
                        label="Amount to Swap"
                        value={swapAmount}
                        onChange={handleSwapAmountChange}
                      />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <TextField
                        label="Payload (e.g., destination address)"
                        value={swapPayload}
                        onChange={handleSwapPayloadChange}
                      />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="dstChainId-label">Destination Chain ID</InputLabel>
                      <Select
                        labelId="dstChainId-label"
                        value={dstChainId}
                        onChange={handleDstChainIdChange}
                      >
                        <MenuItem value={10002}>Chain 1</MenuItem>
                        <MenuItem value={10003}>Chain 2</MenuItem>
                      </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={sendMessage}>
                      Send LayerZero Message
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Historical Data
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={historicalData}
                        margin={{
                          top: 5, right: 30, left: 20, bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </div>
  );
};

export default FlareFeedConsumer;
