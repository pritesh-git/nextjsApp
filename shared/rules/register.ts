import { z } from 'zod'

export const registerDefaults = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  bio: '',
  about_me: '',
  hobbies: [],
  profile_pic: '',
}

export const registerSchema = z.object({
  first_name: z.string().min(2, { message: 'First name is required' }),
  last_name: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email().min(10, {
    message: 'Email must be at least 10 characters.',
  }),
  password: z.string().min(6, {
    message: 'Password must be least 6 characters',
  }),
  bio: z.string().min(20, { message: 'Bio must be at least 20 characters.' }),
  about_me: z
    .string()
    .min(20, { message: 'About must be at least 20 characters.' }),
  hobbies: z.array(
    z.string().min(1, { message: 'At least one Hobbies required' }),
  ),
  profile_pic: z.string().min(5, { message: 'Profile Picture is required' }),
})

export type registerData = z.infer<typeof registerSchema>
