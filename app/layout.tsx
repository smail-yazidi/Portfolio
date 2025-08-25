import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Smail Yazidi',
  description: '',
  generator: '',
  icon: 'https://ocptjbiqeoasires.public.blob.vercel-storage.com/favicon.ico',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
