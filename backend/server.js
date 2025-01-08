// server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

// Example: Meme coin IDs recognized by CoinGecko
let trackedTokens = [
  'dogecoin',
  'shiba-inu',
  'pepe',
  'floki',
  'baby-doge-coin',
  'wojak',          
];

// This will hold the latest prices
let currentPrices = {};

/**
 * Real fetch from CoinGecko
 * - vs_currency=usd -> get prices in USD
 * - ids=dogecoin,shiba-inu,... -> track multiple IDs at once
 */
async function fetchPriceData() {
  const coinIds = trackedTokens.join(',');
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`CoinGecko request failed with status ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('CoinGecko did not return an array of coins.');
  }

  const prices = {};
  data.forEach((coin) => {
    prices[coin.id] = {
      symbol: coin.symbol,
      name: coin.name,
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      image: coin.image,
    };
  });

  return prices;
}

// Polling job: fetch new data every 10 seconds (adjust as needed)
setInterval(async () => {
  try {
    const newPrices = await fetchPriceData();
    currentPrices = newPrices;
    // Emit new prices to all connected clients
    io.sockets.emit('prices', currentPrices);
  } catch (error) {
    console.error('Error fetching price data:', error);
  }
}, 20000);

// On new socket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Immediately send them the current prices
  socket.emit('prices', currentPrices);

  // On disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});