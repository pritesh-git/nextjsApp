import React from 'react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { cn } from '@/lib/utils'
import { Textarea } from '../ui/textarea'

type Props = {
  label: string
  control: any
  fieldName: string
  placeholder?: string
  formClassName: string
  inputClassName: string
}

const customClasses = cn(
  'text-primary',
  'border-spacing-1',
  'border-primary',
  'focus-visible:ring-none',
)
export default function TextAreaV2({
  label = 'TextArea',
  control,
  fieldName,
  placeholder = '',
  formClassName = '',
  inputClassName = '',
}: Props) {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={cn(formClassName)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className={cn(inputClassName, customClasses)}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
