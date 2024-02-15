import React from 'react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'

type Props = {
  control: any
  label: string
  fieldName: string
  formClassName?: string
}

const customClasses = cn(
  'text-primary',
  'border-spacing-1',
  'border-primary',
  'focus-visible:ring-none',
)
export default function FileInput({
  control,
  label = 'Input',
  fieldName,
  formClassName = '',
}: Props) {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={cn(formClassName)}>
          <FormLabel className="min-w-fit flex items-center">{label}</FormLabel>
          <FormControl>
            <Input type="file" className={cn(customClasses)} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
