import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Worship Songbook',
  description:
    'As the deer pants for streams of water, so my soul pants for you, O God.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} max-w-screen-sm mx-auto min-h-screen`}
      >
        <main className="container mx-auto">{children}</main>
      </body>
    </html>
  );
}
