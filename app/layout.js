import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'REST 2',
  description: 'Repair, Escalate, Service, Troubleshoot. (the second)',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/icon?<generated>" type="image/<generated>" sizes="<generated>" />
      <body className={inter.className}>{children}</body>
    </html>
  )
}
