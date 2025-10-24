import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navigation from '@/components/Navigation'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DVTC Trust Center - Damn Vulnerable Trust Center',
  description: 'Enterprise-grade compliance and security platform (intentionally vulnerable for CTF)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // VULNERABILITY: Global badge override exposed
              window.__BADGES_OVERRIDE = {};
              window.__DEBUG_MODE = true;
              window.__API_URL = '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}';
              console.log('DVTC Trust Center loaded - Debug mode enabled');
              console.log('Hint: Try window.__BADGES_OVERRIDE = {fips_encryption: "ok"}');
            `
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <Toaster position="top-right" />
          <Navigation />
          <div className="pl-64 pt-16">
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}