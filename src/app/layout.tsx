import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Rap Video Generator | Transform Concepts into Epic Music Videos',
  description: 'Transform your rap concepts into epic music video scenes using cutting-edge AI technology. Create professional-quality music videos with advanced AI generation.',
  keywords: 'AI video generator, rap music videos, AI music videos, video generation, music technology, rap videos, AI content creation',
  authors: [{ name: 'AI Rap Video Generator' }],
  openGraph: {
    title: 'AI Rap Video Generator - Transform Rap Concepts into Epic Videos',
    description: 'Create stunning rap music videos using advanced AI technology. Turn your concepts into professional music video scenes.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Rap Video Generator',
    description: 'Transform rap concepts into epic music video scenes with AI',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-black text-white`}>
        <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
          {children}
        </div>
      </body>
    </html>
  )
}