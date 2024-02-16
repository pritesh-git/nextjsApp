import { db } from '@/firebaseConfig'
import { UserType } from '@/shared/interfaces/types'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest, context: any) => {
  try {
    const {
      params: { id },
    } = context

    const queryParams: any = {}

    request.nextUrl.searchParams.forEach((value, key) => {
      queryParams[key] = value
    })

    if (queryParams) {
      // TODO: filter code
    }

    const userDoc = await getDoc(doc(db, 'users', id))

    if (!userDoc.exists()) {
      throw new Error('User not found')
    }

    const userData = userDoc.data() as UserType

    return NextResponse.json({ success: true, data: userData })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Error getting user data',
    })
  }
}

export const PUT = async (request: NextRequest, context: any) => {
  try {
    const {
      params: { id },
    } = context
    const payload = await request.json()

    const userRef = doc(db, 'users', id)
    await updateDoc(userRef, payload)

    const updatedUserDoc = await getDoc(userRef)
    if (!updatedUserDoc.exists()) {
      throw new Error('Updated user data not found')
    }

    const updatedUserData = {
      id: updatedUserDoc.id,
      ...updatedUserDoc.data(),
    } as UserType

    return NextResponse.json({ success: true, data: updatedUserData })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Error updating user data',
    })
  }
}
