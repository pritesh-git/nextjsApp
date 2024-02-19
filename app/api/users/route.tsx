import { db } from '@/firebaseConfig'
import { UserType } from '@/shared/interfaces/types'
import { DocumentData, collection, getDocs } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    const queryParams: any = {}

    request.nextUrl.searchParams.forEach((value, key) => {
      queryParams[key] = value
    })

    if (queryParams) {
      // TODO: filter code
    }

    const data: UserType[] = []
    const querySnapshot = await getDocs(collection(db, 'users'))
    querySnapshot.forEach((doc: DocumentData) => {
      data.push({ id: doc.id, ...doc.data() } as UserType)
    })

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, data: 'User not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Error getting Users data',
      },
      { status: 500 },
    )
  }
}
