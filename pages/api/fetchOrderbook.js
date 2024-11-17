import axios from 'axios';

export default async function handler(req, res) {
  const { symbol = 'BTCUSDT' } = req.query;
  const url = `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=10`;

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Binance' });
  }
}
