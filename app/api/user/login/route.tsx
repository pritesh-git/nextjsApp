import { db } from '@/firebaseConfig'
import { UserType } from '@/shared/interfaces/types'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const { email, password } = await request.json()

    const usersRef = query(collection(db, 'users'), where('email', '==', email))
    const querySnapshot = await getDocs(usersRef)

    if (querySnapshot.empty) {
      return { success: false, message: 'Email not found' }
    }

    const userDoc = querySnapshot.docs[0]
    const userData = { id: userDoc.id, ...userDoc.data() } as UserType

    if (userData.password !== password) {
      return { success: false, message: 'Password incorrect' }
    }

    if (!userData.active_status) {
      return { success: false, message: 'User is not active' }
    }

    return NextResponse.json({ success: true, data: userData })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'An error occurred',
    })
  }
}
