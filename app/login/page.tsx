'use client'
import InputV2 from '@/components/form-helper/InputV2'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useAuthContext } from '@/lib/AuthContext'
import { loginData, loginDefaults, loginSchema } from '@/shared/rules/login'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const Page: NextPage = () => {
  const router = useRouter()
  const { isLoggedIn, setIsLoggedIn, setUser } = useAuthContext()

  const form = useForm<loginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaults,
  })

  useEffect(() => {
    if (isLoggedIn) router.push('/')
  }, [isLoggedIn, router])

  const handleReset = () => {
    form.reset(loginDefaults)
  }

  const onSubmit = async (values: loginData) => {
    try {
      const resp = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      })
      const data = await resp.json()
      if (!resp.ok) {
        throw new Error(data.message)
      }
      setUser(data)
      setIsLoggedIn(true)
      toast.success('Successfully Logged In')
      handleReset()
      router.push('/')
    } catch (err: any) {
      toast.error('Uh oh! Something went wrong.', {
        description: err.message || 'There was a problem with your request.',
      })
    }
  }

  return (
    <main className="p-5 rounded-md shadow-xl border-2 shadow-slate-700 bg-opacity-50 backdrop-blur-3xl">
      <span className="text-2xl flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        Login
      </span>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={handleReset}
          className="space-y-5 p-5 ">
          <InputV2
            type="email"
            control={form.control}
            label="Email"
            fieldName="email"
            placeholder="Enter Email"
          />
          <InputV2
            type="password"
            control={form.control}
            label="Password"
            fieldName="password"
            placeholder="Enter Password"
          />
          <div className="flex flex-row justify-evenly gap-x-3">
            <Button type="submit" variant={'default'}>
              Submit
            </Button>
            <Button type="reset" variant={'outline'}>
              Reset
            </Button>
          </div>
        </form>
      </Form>
      <p className="w-full text-center">
        Don&#39;t have a account?{' '}
        <Link href="/register" className="font-bold">
          Register
        </Link>{' '}
        now
      </p>
    </main>
  )
}

export default Page
