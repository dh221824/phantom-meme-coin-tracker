import Image from 'next/image';
import SocketPrices from './components/SocketPrices';
import PhantomConnection from './components/PhantomConnection';

export default function Home() {
  return (
    <main className="p-8">

      {/* Display real meme coin prices from the Socket.IO feed */}
      <SocketPrices />

      {/* 2) Render Phantom connection */}
      <PhantomConnection />
    </main>
  );
}
