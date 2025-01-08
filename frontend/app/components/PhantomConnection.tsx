'use client';

import React, { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { Connection, clusterApiUrl } from '@solana/web3.js';

const connection = new Connection(clusterApiUrl('devnet'));

//connection.getBalance(publicKey)


/**
 * PhantomConnection
 *
 * This component checks if Phantom is installed,
 * connects to it on user request, and shows the connected wallet address.
 */
export default function PhantomConnection() {
  const [isPhantomAvailable, setIsPhantomAvailable] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

  useEffect(() => {
    // Check if 'solana' is present in the browser's window object
    if (typeof window !== 'undefined' && 'solana' in window) {
      const provider = (window as any).solana;
      if (provider?.isPhantom) {
        setIsPhantomAvailable(true);
        // Optional: auto-connect if the user has approved in the past
        // provider.connect({ onlyIfTrusted: true }).then(() => {...}).catch(() => {...});
      }
    }
  }, []);

  // Trigger Phantom's connect flow
  const connectPhantom = async () => {
    try {
      const provider = (window as any).solana;
      if (!provider) {
        alert('Phantom Wallet not found! Please install it first.');
        return;
      }
      // Request user to connect
      const resp = await provider.connect();
      setPublicKey(resp.publicKey);
      console.log('Connected with public key:', resp.publicKey.toString());
    } catch (err) {
      console.error('Error connecting to Phantom:', err);
    }
  };

  return (
    <div className="p-4 border rounded-md max-w-md mx-auto mt-4 text-center">
      <h2 className="text-xl font-semibold mb-2">Phantom Wallet Connection</h2>

      {publicKey ? (
        <p className="text-green-600">
          <strong>Connected address:</strong> {publicKey.toString()}
        </p>
      ) : (
        <>
          {isPhantomAvailable ? (
            <>
              <p className="text-blue-600">Phantom is installed but not connected.</p>
              <button
                className="mt-3 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                onClick={connectPhantom}
              >
                Connect Phantom
              </button>
            </>
          ) : (
            <p className="text-red-600">Phantom is NOT installed in your browser.</p>
          )}
        </>
      )}
    </div>
  );
}
