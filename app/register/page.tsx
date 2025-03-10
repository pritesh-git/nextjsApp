'use client'
import CheckboxGroup from '@/components/form-helper/CheckboxGroup'
import FileInput from '@/components/form-helper/FileInput'
import InputV2 from '@/components/form-helper/InputV2'
import TextAreaV2 from '@/components/form-helper/TextAreaV2'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { UserType } from '@/shared/interfaces/types'
import {
  registerData,
  registerDefaults,
  registerSchema,
} from '@/shared/rules/register'
import { hobbiesList } from '@/shared/static/staticOptions'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const Page: NextPage = () => {
  const router = useRouter()

  const [selected, setSelected] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState(undefined)

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
      const payload: UserType<File> = {
        ...values,
        hobbies: selected,
        profile_pic: selectedFile,
      }

      const formData = new FormData()

      for (const key in payload) {
        if (payload.hasOwnProperty(key)) {
          if (key === 'profile_pic' && payload[key] instanceof File) {
            formData.append(key, payload[key] as File)
          } else {
            formData.append(key, payload[key])
          }
        }
      }

      const resp = await fetch('/api/user/register', {
        method: 'POST',
        body: formData,
      })

      const data = await resp.json()
      if (!resp.ok) {
        throw new Error(data.message)
      }
      toast.success('Successfully Registered')
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
            handleChange={setSelectedFile}
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
      <p className="w-full text-center">
        Already have a account?{' '}
        <Link href="/login" className="font-bold">
          Login
        </Link>{' '}
        now
      </p>
    </main>
  )
}

export default Page
