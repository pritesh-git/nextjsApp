import { z } from 'zod'

export const loginDefaults = {
  email: '',
  password: '',
}

export const loginSchema = z.object({
  email: z
    .string()
    .min(10, {
      message: 'email must be at least 10 characters.',
    })
    .email({ message: 'Invalid Email' }),
  password: z.string().min(6, {
    message: 'Password must be least 6 characters',
  }),
})

export type loginData = z.infer<typeof loginSchema>
