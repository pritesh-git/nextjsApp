import { cn } from '@/lib/utils'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'

type Props = {
  type?: string
  control: any
  label: string
  fieldName: string
  placeholder?: string
}

const customClasses = cn(
  'text-primary',
  'border-spacing-1',
  'border-primary',
  'focus-visible:ring-none',
)
export default function InputV2({
  type = 'text',
  control,
  label = 'Input',
  fieldName,
  placeholder = '',
}: Props) {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              className={cn(customClasses)}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
