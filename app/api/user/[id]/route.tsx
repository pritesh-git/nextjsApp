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
      return NextResponse.json(
        { success: false, data: 'User not found' },
        { status: 404 },
      )
    }

    const userData = userDoc.data() as UserType

    return NextResponse.json({ success: true, data: userData }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Error getting user data',
      },
      { status: 500 },
    )
  }
}

export const PUT = async (request: NextRequest, context: any) => {
  try {
    const {
      params: { id },
    } = context
    const payload = await request.json()

    const userRef = doc(db, 'users', id)

    const getUserDoc = await getDoc(userRef)
    if (!getUserDoc.exists()) {
      return NextResponse.json(
        { success: false, data: 'User not found' },
        { status: 404 },
      )
    }
    await updateDoc(userRef, payload)

    return NextResponse.json(
      { success: true, message: 'Updated SuccessFully' },
      { status: 204 },
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Error updating user data',
      },
      { status: 500 },
    )
  }
}
