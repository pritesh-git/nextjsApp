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
  control: any
  label: string
  fieldName: string
  formClassName?: string
  handleChange: (el: any) => void
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
  handleChange,
}: Props) {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={cn(formClassName)}>
          <FormLabel className="min-w-fit flex items-center">{label}</FormLabel>
          <FormControl>
            <Input
              type="file"
              className={cn(customClasses)}
              {...field}
              onBlur={el => handleChange(el.target.files?.[0])}
              accept="image/*"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
