import { UserType, UsersResponse } from '@/shared/interfaces/types'
import { db } from '../firebaseConfig'
import {
  getDocs,
  collection,
  DocumentData,
  query,
  where,
  addDoc,
  getDoc,
} from 'firebase/firestore'

export const getAllUsers = async (): Promise<UsersResponse> => {
  try {
    const data: UserType[] = []
    const querySnapshot = await getDocs(collection(db, 'users'))
    querySnapshot.forEach((doc: DocumentData) => {
      data.push({ id: doc.id, ...doc.data() } as UserType)
    })
    if (data.length === 0) {
      throw new Error('Empty or invalid data')
    }
    return { success: true, data }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error getting Users data',
    }
  }
}

export const loginUser = async (
  email: string,
  password: string,
): Promise<UsersResponse> => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', email))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return { success: false, message: 'Email not found' }
    }

    const userDoc = querySnapshot.docs[0]
    const userData = userDoc.data() as UserType

    if (userData.password !== password) {
      return { success: false, message: 'Password incorrect' }
    }

    if (!userData.active_status) {
      return { success: false, message: 'User is not active' }
    }

    return { success: true, data: userData }
  } catch (error: any) {
    return { success: false, message: error.message || 'an error occurred' }
  }
}

export const registerUser = async (
  user: Partial<UserType>,
): Promise<UsersResponse> => {
  try {
    const seedCustomData = {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      password: user.password || '',
      bio: user.bio || '',
      about_me: user.about_me || '',
      hobbies: user.hobbies || [],
      active_status:
        user.active_status !== undefined ? user.active_status : true,
      create_date: user.create_date || new Date(),
    } as UserType

    seedCustomData.fullName =
      seedCustomData.first_name + ' ' + seedCustomData.last_name

    const userRef = await addDoc(collection(db, 'users'), seedCustomData)

    const newUserDoc = await getDoc(userRef)
    const newUser = newUserDoc.data() as UserType

    if (!newUser) {
      throw new Error('Failed to register user')
    }

    return { success: true, data: newUser }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'An error occurred during registration',
    }
  }
}
