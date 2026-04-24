import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SettingsProvider } from '@/context/SettingsContext';
import FontAwesomeSetup from '@/components/FontAwesomeSetup';

export const metadata: Metadata = {
  title: 'Elprisen.nu',
  description: 'Nuværende og historiske elpriser for Danmark – live opdateret',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Elprisen.nu',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  themeColor: '#27282B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <head>
        <link rel="apple-touch-icon" href="/icons/ios/180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/ios/152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/ios/167.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/ios/180.png" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-app-dark text-price-muted font-roboto min-h-screen antialiased">
        <FontAwesomeSetup />
        <SettingsProvider>{children}</SettingsProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js')})}`,
          }}
        />
      </body>
    </html>
  );
}
