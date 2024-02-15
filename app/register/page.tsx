'use client'
import React, { useState } from 'react'
import { NextPage } from 'next'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { hobbiesList } from '@/shared/static/staticOptions'
import {
  registerData,
  registerDefaults,
  registerSchema,
} from '@/shared/rules/register'
import InputV2 from '@/components/form-helper/InputV2'
import TextAreaV2 from '@/components/form-helper/TextAreaV2'
import CheckboxGroup from '@/components/form-helper/CheckboxGroup'
import FileInput from '@/components/form-helper/FileInput'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/lib/actions'

const Page: NextPage = () => {
  const { toast } = useToast()
  const router = useRouter()

  const [selected, setSelected] = useState<string[]>([])

  const form = useForm<registerData>({
    resolver: zodResolver(registerSchema),
    defaultValues: registerDefaults,
  })

  const handleReset = () => {
    form.reset(registerDefaults)
    setSelected([])
  }

  const onSubmit = async (values: registerData) => {
    try {
      const payload = { ...values, hobbies: selected }
      const resp = await registerUser(payload)
      toast({
        variant: 'success',
        description: 'Successfully Registered',
        duration: 2500,
      })
      console.log('resp', resp)
    } catch (err) {
      console.log('err', err)
      toast({
        duration: 2500,
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
      handleReset()
    }
  }

  return (
    <main className="p-5 rounded-md shadow-xl border-2 shadow-slate-700 bg-opacity-50 backdrop-blur-3xl">
      <span className="text-2xl flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        Register
      </span>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={handleReset}
          className="gap-5 grid sm:grid-cols-2 p-5">
          <InputV2
            type="text"
            control={form.control}
            label="First Name"
            fieldName="first_name"
            placeholder="Enter First Name"
          />
          <InputV2
            type="text"
            control={form.control}
            label="Last Name"
            fieldName="last_name"
            placeholder="Enter Last Name"
          />
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
          <TextAreaV2
            label="Bio"
            control={form.control}
            fieldName="bio"
            placeholder="Tell us a little bit about yourself"
            formClassName="sm:col-span-2"
            inputClassName="resize-none"
          />
          <TextAreaV2
            label="About Me"
            control={form.control}
            fieldName="about_me"
            placeholder="Describe a little bit about yourself"
            formClassName="sm:col-span-2"
            inputClassName="resize-none"
          />
          <CheckboxGroup
            label="Hobbies"
            control={form.control}
            fieldName="hobbies"
            checkboxList={hobbiesList}
            selected={selected}
            setSelected={setSelected}
            formClassName="sm:col-span-2"
            innerFormClassName="flex flex-row items-start space-x-3 space-y-0"
            wrapperClassName="grid grid-cols-2 sm:grid-cols-4 gap-4"
          />
          <FileInput
            control={form.control}
            label="Profile Picture"
            fieldName="profile_pic"
            formClassName="flex flex-col sm:flex-row gap-3 sm:col-span-2"
          />
          <div className="flex flex-row justify-evenly mt-5 gap-x-3 w-full sm:col-span-2">
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
