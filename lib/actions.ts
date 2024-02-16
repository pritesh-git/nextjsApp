import { UserType, UsersResponse } from '@/shared/interfaces/types'
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebaseConfig'

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

export const updateUserById = async (
  userId: string,
  updatedData: Partial<UserType>,
): Promise<UsersResponse> => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, updatedData)

    const updatedUserDoc = await getDoc(userRef)
    if (!updatedUserDoc.exists()) {
      throw new Error('Updated user data not found')
    }

    const updatedUserData = updatedUserDoc.data() as UserType
    return { success: true, data: updatedUserData }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error updating user data',
    }
  }
}

export const getUserById = async (userId: string): Promise<UsersResponse> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) {
      throw new Error('User not found')
    }
    const userData = userDoc.data() as UserType
    return { success: true, data: userData }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error getting user data',
    }
  }
}

export const loginUser = async (
  email: string,
  password: string,
): Promise<UsersResponse> => {
  try {
    const usersRef = query(collection(db, 'users'), where('email', '==', email))
    const querySnapshot = await getDocs(usersRef)

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
    const existingUsersQuery = query(
      collection(db, 'users'),
      where('email', '==', user.email),
    )
    const existingUsersSnapshot = await getDocs(existingUsersQuery)
    if (!existingUsersSnapshot.empty) {
      return {
        success: false,
        message: 'Email already exists. Please use a different email.',
      }
    }

    const seedCustomData = {
      ...user,
      hobbies: user.hobbies || [],
      active_status:
        user.active_status !== undefined ? user.active_status : true,
      create_date: user.create_date || new Date(),
    } as UserType

    seedCustomData.fullName = `${seedCustomData.first_name} ${seedCustomData.last_name}`

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
