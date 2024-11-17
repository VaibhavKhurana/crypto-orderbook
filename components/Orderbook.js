import { useEffect, useState } from 'react';
import axios from 'axios';

const Orderbook = () => {
  const [orderbook, setOrderbook] = useState({ bids: [], asks: [] });
  const [pair, setPair] = useState('BTCUSDT');
  const [prevOrderbook, setPrevOrderbook] = useState({ bids: [], asks: [] });

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/fetchOrderbook?symbol=${pair}`);
      setPrevOrderbook(orderbook); // Store previous orderbook data
      setOrderbook(response.data);
    };

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [orderbook, pair]);

  const getPriceChangeClass = (price, prevPrice) => {
    if (!prevPrice) return '';
    return price > prevPrice ? 'price-up' : 'price-down';
  };

  const handlePairChange = (event) => {
    setPair(event.target.value);
  };

  return (
    <div>
      <h2>Orderbook</h2>
      <select onChange={handlePairChange} value={pair}>
        <option value="BTCUSDT">BTC-USD</option>
        <option value="ETHUSDT">ETH-USD</option>
        <option value="XRPUSDT">XRP-USD</option>
        <option value="BNBUSDT">BNB-USD</option>
      </select>

      <div className="orderbook">
        <div>
          <h3>Bids</h3>
          {orderbook.bids.map((bid, idx) => {
            const prevBidPrice = prevOrderbook.bids[idx]?.[0];
            return (
              <div key={idx} className={getPriceChangeClass(bid[0], prevBidPrice)}>
                {`${bid[0]} (Price) | ${bid[1]} (Volume)`}
              </div>
            );
          })}
        </div>
        <div>
          <h3>Asks</h3>
          {orderbook.asks.map((ask, idx) => {
            const prevAskPrice = prevOrderbook.asks[idx]?.[0];
            return (
              <div key={idx} className={getPriceChangeClass(ask[0], prevAskPrice)}>
                {`${ask[0]} (Price) | ${ask[1]} (Volume)`}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orderbook;
