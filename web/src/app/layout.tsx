import type { Metadata } from 'next';
import type { JSX, ReactNode } from 'react';
import './globals.css';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: 'Your next delivery',
  description: 'Details of your next fresh food delivery.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en-GB">
      <body>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
