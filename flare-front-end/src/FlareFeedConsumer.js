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
  FormControl,
  CircularProgress,
  Alert,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FlareFeedConsumer = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [feedValues, setFeedValues] = useState([]);
  const [timestamp, setTimestamp] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [dstChainId, setDstChainId] = useState(40217); // Example destination chain ID
  const [destination, setDestination] = useState("0x93eC5e12AC770eF01920dF0D870b5A075937b55b"); // Destination address on the destination chain
  const [swapAmount, setSwapAmount] = useState("");
  const [swapPayload, setSwapPayload] = useState("");
  const [selectedPair, setSelectedPair] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const contractAddress = "0x49d1F9f16B431D8DD8cE2E233f145F706C293753"; // Replace with your deployed contract address
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
      setLoading(true);
      setAlert(null);
      try {
        const amount = parseInt(swapAmount);
        if (isNaN(amount)) {
          throw new Error("Invalid swap amount");
        }

        const payload = ethers.utils.defaultAbiCoder.encode(
          ["string", "uint256"],
          [swapPayload, amount]
        );
        const options = ethers.utils.defaultAbiCoder.encode(
          ["uint256"], [3000000] // Example option: gas limit
        );
        const tx = await contract.send(dstChainId, payload, options, {
          value: ethers.utils.parseEther("0.1"), // Adjust the value as needed
          gasLimit: 5000000 // Manually specify the gas limit
        });
        await tx.wait();
        setAlert({ type: 'success', message: 'Message sent successfully' });
      } catch (error) {
        console.error("Error sending message:", error);
        setAlert({ type: 'error', message: error.message });
      }
      setLoading(false);
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

  const handlePairChange = (e) => {
    setSelectedPair(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
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
                      <InputLabel id="pair-label">Select Pair</InputLabel>
                      <Select
                        labelId="pair-label"
                        value={selectedPair}
                        onChange={handlePairChange}
                      >
                        {assetPairs.map((pair, index) => (
                          <MenuItem key={index} value={pair}>
                            {pair}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <TextField
                        label="Amount to Swap"
                        value={swapAmount}
                        onChange={handleSwapAmountChange}
                      />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <TextField
                        label="Payload (e.g., message)"
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
                        <MenuItem value={40217}>Holesky</MenuItem>
                        <MenuItem value={40231}>Arbitrum Sepolia Testnet</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <TextField
                        label="Destination Address"
                        value={destination}
                        onChange={handleDestinationChange}
                      />
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={sendMessage} disabled={loading}>
                      {loading ? <CircularProgress size={24} /> : 'Send LayerZero Message'}
                    </Button>
                    {alert && (
                      <Alert severity={alert.type} style={{ marginTop: 20 }}>
                        {alert.message}
                      </Alert>
                    )}
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
