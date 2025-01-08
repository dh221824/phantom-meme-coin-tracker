import React, { useEffect, useState } from 'react';

interface SolanaWindow extends Window {
  solana: {
    isPhantom: boolean;
    connect: () => Promise<{ publicKey: { toString: () => string } }>;
  };
}

declare const window: SolanaWindow;

useEffect(() => {
    if ('solana' in window) {
      const provider = window.solana as { isPhantom: boolean };
      if (provider.isPhantom) {
        console.log('Phantom wallet is available');
      }
    }
  }, []);

  const connectPhantom = async () => {
    try {
      const resp = await window.solana.connect();
      console.log('Connected with public key:', resp.publicKey.toString());
    } catch (err) {
      console.error(err);
    }
  };
  
  