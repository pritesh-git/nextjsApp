'use client'
import { UserType } from '@/shared/interfaces/types'
import React, { createContext, useContext, useState } from 'react'

type AuthContextType = {
  isLoggedIn: boolean
  setIsLoggedIn: (val: boolean) => void
  user: UserType | null
  setUser: (val: any) => void
}
type AppProps = {
  children: React.ReactNode
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
})

export const AuthWrapper = ({ children }: AppProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [user, setUser] = useState<UserType | null>(null)

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
