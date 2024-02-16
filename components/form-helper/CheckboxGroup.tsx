import { cn } from '@/lib/utils'
import { Checkbox } from '../ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'

type Props = {
  label: string
  control: any
  fieldName: string
  formClassName: string
  innerFormClassName: string
  wrapperClassName: string
  checkboxList: { id: string; label: string }[]
  selected: string[]
  setSelected: (val: string[]) => void
}

export default function CheckboxGroup({
  label = 'Checkbox',
  control,
  fieldName,
  formClassName = '',
  innerFormClassName = '',
  wrapperClassName = '',
  checkboxList,
  selected = [],
  setSelected,
}: Props) {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={() => (
        <FormItem className={cn(formClassName)}>
          <FormLabel className="text-base mb-4">{label}</FormLabel>
          <div className={cn(wrapperClassName)}>
            {checkboxList.map(item => (
              <FormField
                key={item.id}
                control={control}
                name={label}
                render={({ field }) => {
                  const isChecked = selected.includes(item.id)

                  return (
                    <FormItem key={item.id} className={cn(innerFormClassName)}>
                      <FormControl>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked: boolean) => {
                            const updatedState = checked
                              ? [...selected, item.id]
                              : selected.filter((id: string) => id !== item.id)

                            field.onChange(updatedState)
                            setSelected(updatedState)
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  )
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
