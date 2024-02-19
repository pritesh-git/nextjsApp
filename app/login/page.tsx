'use client'
import InputV2 from '@/components/form-helper/InputV2'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { loginData, loginDefaults, loginSchema } from '@/shared/rules/login'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

const Page: NextPage = () => {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<loginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaults,
  })

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
      toast({
        variant: 'success',
        description: 'Successfully Logged In',
        duration: 2500,
      })
      handleReset()
    } catch (err: any) {
      toast({
        duration: 2500,
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: err.message || 'There was a problem with your request.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
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
    </main>
  )
}

export default Page
