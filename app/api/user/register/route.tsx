import { db } from '@/firebaseConfig'
import { UserType } from '@/shared/interfaces/types'
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const user = await request.json()

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
    const newUser = { id: newUserDoc.id, ...newUserDoc.data() } as UserType
    if (!newUser) {
      throw new Error('Failed to register user')
    }
    return NextResponse.json({ success: true, data: newUser })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'An error occurred during registration',
    })
  }
}
