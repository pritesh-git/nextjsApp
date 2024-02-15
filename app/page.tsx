'use client'
import { getAllUsers } from '@/lib/actions'
import { NextPage } from 'next'
import { useEffect } from 'react'
import { useAuthContext } from '@/lib/AuthContext'

const Home: NextPage = () => {
  return (
    <main className="min-h-screen">
      <div className="flex justify-center">
        <div className="w-full max-w-[900px] flex flex-row border border-red-700 p-5"></div>
      </div>
    </main>
  )
}

export default Home
