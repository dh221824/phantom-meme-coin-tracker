'use client';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

interface CoinData {
  [key: string]: {
    symbol: string;
    name: string;
    price: number;
    marketCap: number;
    change24h: number;
    image: string;
  };
}

export default function SocketPrices() {
  const [prices, setPrices] = useState<CoinData>({});

  useEffect(() => {
    // Connect to the backend
    const socket = io('http://localhost:8080'); // or your production URL

    // Listen for the "prices" event each time the backend emits
    socket.on('prices', (updatedPrices: CoinData) => {
      console.log('Received updated prices:', updatedPrices); // for debugging
      setPrices(updatedPrices);
    });

    // Cleanup: disconnect on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <section className="mt-4">
      <h2 className="text-xl font-bold mb-2">Meme Coin Prices</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(prices).map(([coinId, info]) => (
          <div key={coinId} className="p-4 border rounded">
            <div className="flex items-center gap-2 mb-2">
              <img src={info.image} alt={info.name} width={32} height={32} />
              <h3 className="font-semibold">
                {info.name} ({info.symbol.toUpperCase()})
              </h3>
            </div>
            {/* Display with 10 decimal places */}
            <p>Price: ${info.price.toFixed(10)}</p>
            <p>Market Cap: ${info.marketCap?.toLocaleString()}</p>
            {/* 24h change with 2 decimal places */}
            <p
              className={info.change24h >= 0 ? 'text-green-600' : 'text-red-600'}
            >
              24h Change: {info.change24h?.toFixed(2)}%
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
