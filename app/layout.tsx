import NavHeader from '@/components/NavHeader'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AuthWrapper } from '@/lib/AuthContext'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import '../styles/globals.css'

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
            <Toaster richColors />
          </ThemeProvider>
        </AuthWrapper>
      </body>
    </html>
  )
}
