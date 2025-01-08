'use client';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function SocketPrices() {
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    // Connect to your Socket.IO server
    const socket = io('http://localhost:8080'); // adjust URL as needed

    // Listen for the "prices" event from the backend
    socket.on('prices', (newPrices) => {
      setPrices(newPrices);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <section className="flex flex-col gap-2 items-center">
      <h2 className="text-xl font-semibold">Live Prices</h2>
      <pre>{JSON.stringify(prices, null, 2)}</pre>
    </section>
  );
}
