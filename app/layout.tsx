import { Inter } from 'next/font/google'
import { Providers } from '@/app/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SkyMithra - Drone Services',
  description: 'Revolutionizing industries with cutting-edge drone technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}