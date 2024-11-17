import Orderbook from '../components/Orderbook';
import SpreadIndicator from '../components/SpreadIndicator';
import OrderbookImbalance from '../components/OrderbookImbalance';
import MarketDepthChart from '../components/MarketDepthChart';
import { useState, useEffect } from 'react';
import axios from 'axios'; 
import "../styles/globals.css";

const Home = () => {
  const [orderbook, setOrderbook] = useState({ bids: [], asks: [] });

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/fetchOrderbook');
      setOrderbook(response.data);
    };

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Crypto Trading Dashboard</h1>
      <Orderbook />
      <SpreadIndicator />
      <OrderbookImbalance orderbook={orderbook} />
      <MarketDepthChart orderbook={orderbook} />
    </div>
  );
};

export default Home;
