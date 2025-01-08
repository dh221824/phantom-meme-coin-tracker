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

// Example tracked tokens
let trackedTokens = ['TOKEN_A', 'TOKEN_B'];

let currentPrices = {};

// Example function to fetch price data
async function fetchPriceData() {
  // For demonstration, we’ll just return a mock
  // In reality, you’d hit CoinGecko or another aggregator
  return {
    TOKEN_A: (Math.random() * 0.0001).toFixed(8),
    TOKEN_B: (Math.random() * 0.0001).toFixed(8),
  };
}

// Polling job to update prices
setInterval(async () => {
  try {
    currentPrices = await fetchPriceData();
    // Broadcast updated prices to all connected clients
    io.sockets.emit('prices', currentPrices);
  } catch (error) {
    console.error('Error fetching price data:', error);
  }
}, 5000); // Poll every 5 seconds

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  // Send current prices upon new connection
  socket.emit('prices', currentPrices);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
