import { UserType } from '@/shared/interfaces/types'
import { isEmpty, isString } from 'lodash'

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateLogin = (payload: any) => {
  let isInvalid: boolean = false
  let error: any = {}
  if (
    !isString(payload.email) ||
    isEmpty(payload.email) ||
    !isValidEmail(payload.email)
  ) {
    isInvalid = true
    error['email'] = 'Invalid email address'
  }
  if (!isString(payload.password) || isEmpty(payload.password)) {
    isInvalid = true
    error['password'] = 'Invalid password'
  }

  return { isInvalid, error }
}

export const validateRegister = (payload: Partial<UserType<File>>) => {
  let isInvalid: boolean = false
  let error: any = {}

  const requiredFields = [
    'email',
    'password',
    'first_name',
    'last_name',
    'hobbies',
  ]
  const optionalFields = ['profile_pic']

  requiredFields.forEach(field => {
    if (!isString(payload[field]) || isEmpty(payload[field])) {
      isInvalid = true
      error[field] = `${field.replace('_', ' ')} is required`
    }
  })

  optionalFields.forEach(field => {
    if (!payload[field]) {
      isInvalid = true
      error[field] = `${field.replace('_', ' ')} is required`
    } else if (!(payload[field] instanceof File)) {
      isInvalid = true
      error[field] = `${field.replace('_', ' ')} must be a file`
    } else {
      const file = payload[field] as File
      const maxSizeMB = 5
      const allowedTypes = ['image/jpeg', 'image/png']

      if (file.size > maxSizeMB * 1024 * 1024) {
        isInvalid = true
        error[field] = `Maximum file size exceeded (${maxSizeMB} MB)`
      }

      if (!allowedTypes.includes(file.type)) {
        isInvalid = true
        error[field] = `Invalid file type. Allowed types: ${allowedTypes.join(
          ', ',
        )}`
      }
    }
  })

  return { isInvalid, error }
}
