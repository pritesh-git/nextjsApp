import { db } from '@/firebaseConfig'
import { validateLogin } from '@/lib/helper/validateAuthRequest'
import { UserType } from '@/shared/interfaces/types'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const { email, password } = await request.json()
    const { isInvalid, error } = validateLogin({ email, password })
    if (isInvalid) {
      throw new Error(JSON.stringify(error))
    }

    const usersRef = query(collection(db, 'users'), where('email', '==', email))
    const querySnapshot = await getDocs(usersRef)

    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, message: 'Email not found' },
        { status: 400 },
      )
    }

    const userDoc = querySnapshot.docs[0]
    const userData = { id: userDoc.id, ...userDoc.data() } as UserType

    if (userData.password !== password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password incorrect',
        },
        { status: 400 },
      )
    }

    if (!userData.active_status) {
      return NextResponse.json(
        {
          success: false,
          message: 'User is not active',
        },
        { status: 403 },
      )
    }

    return NextResponse.json({ success: true, data: userData }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: JSON.parse(error.message) || 'An error occurred',
      },
      { status: 500 },
    )
  }
}
