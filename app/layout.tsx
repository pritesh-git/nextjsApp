import { Inter } from 'next/font/google'
import '../styles/globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { ReactNode } from 'react'
import NavHeader from '@/components/NavHeader'
import { Toaster } from '@/components/ui/toaster'
import { AuthWrapper } from '@/lib/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Blogiee',
    template: '%s | Blogiee',
  },
  description: 'Blog post website',
  icons: { icon: ['/logo.png'] },
}

type PropsType = {
  children: ReactNode
}

export default function RootLayout({
  children,
}: Readonly<PropsType>): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <NavHeader />
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthWrapper>
      </body>
    </html>
  )
}

