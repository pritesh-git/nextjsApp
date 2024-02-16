'use client'
import { useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'

const NotFound: FC = () => {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 6000)

    // Clear the timer on component unmount to avoid memory leaks
    return () => clearTimeout(timer)
  }, [router])

  return (
    <section className="page_404 py-40 font-serif">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="text-center">
            <div
              className="bg-cover bg-center h-80 sm:h-96"
              style={{
                background:
                  'url(/404-toon.gif) no-repeat center center / contain',
              }}>
              <h1 className="text-6xl">404</h1>
            </div>

            <h3 className="text-6xl my-4">Look like you`re lost</h3>
            <p>The page you are looking for is not available!</p>
            <a
              href="/"
              className="inline-block rounded-md bg-green-400 hover:bg-green-600 px-8 py-4 mt-4">
              Go to Home
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotFound
