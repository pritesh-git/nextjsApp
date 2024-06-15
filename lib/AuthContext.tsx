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
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(() => {
    const loggedIn = localStorage.getItem('isLoggedIn')
    return loggedIn ? JSON.parse(loggedIn) : false
  })
  const [user, setUserState] = useState<UserType | null>(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const setIsLoggedIn = (val: boolean) => {
    setIsLoggedInState(val)
    localStorage.setItem('isLoggedIn', JSON.stringify(val))
  }

  const setUser = (val: any) => {
    setUserState(val)
    localStorage.setItem('user', JSON.stringify(val))
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
