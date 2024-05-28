import './globals.css';
import Header from './components/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Manage your tasks efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-white">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="h-full">
        <Header />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}