import Image from 'next/image';
import SocketPrices from './components/SocketPrices';  // optional, if you have that
import PhantomConnection from './components/PhantomConnection';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <main className="w-full max-w-4xl">

        {/* Example Next.js boilerplate content */}
        <h1 className="text-3xl font-bold mb-4">My Meme Coin Tracker</h1>
        <div className="mb-8">
          <Image
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
            className="dark:invert"
          />
        </div>

        {/* 1) Render your SocketPrices (if you implemented real-time prices) */}
        <SocketPrices />

        {/* 2) Render Phantom connection */}
        <PhantomConnection />

      </main>
    </div>
  );
}
