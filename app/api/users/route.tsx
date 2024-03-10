import { db } from '@/firebaseConfig'
import { UserType } from '@/shared/interfaces/types'
import { validSortKeys } from '@/shared/static/staticOptions'
import {
  DocumentData,
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { ceil, includes, toNumber } from 'lodash'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    const queryParams: any = {}
    const filters = []
    let sortingBy = 'create_date'
    let sortingOrder: 'asc' | 'desc' = 'asc'
    let dataLimit = 10
    request.nextUrl.searchParams.forEach((value, key) => {
      queryParams[key] = value
    })

    if (queryParams) {
      const { limit, sortOrder, sortBy, name, email } = queryParams

      if (limit != null && !isNaN(toNumber(limit)) && toNumber(limit) > 0) {
        dataLimit = limit
      }

      if (name || email) {
        if (name && name.length) {
          filters.push(where('fullName', '>=', name))
          filters.push(where('fullName', '<=', name + '\uf8ff'))
          sortingBy = 'fullName'
        }
        if (email && email.length) {
          filters.push(where('email', '>=', email))
          filters.push(where('email', '<=', email + '\uf8ff'))
          sortingBy = 'email'
        }
      } else {
        if (sortBy != null && includes(validSortKeys, sortBy)) {
          sortingBy = sortBy
        }
      }
      if (sortOrder != null && includes(['asc', 'desc'], sortOrder)) {
        sortingOrder = sortOrder
      }
    }

    const data: UserType[] = []
    const customQuery = query(
      collection(db, 'users'),
      ...filters,
      orderBy(sortingBy, sortingOrder),
    )
    const count = (await getCountFromServer(query(customQuery))).data().count
    const totalData = {
      dataCount: count,
      limit: dataLimit,
      totalPage: dataLimit <= count ? ceil(count / dataLimit) : 1,
    }

    const querySnapshot = await getDocs(query(customQuery, limit(dataLimit)))
    querySnapshot.forEach((doc: DocumentData) => {
      data.push({ id: doc.id, ...doc.data() } as UserType)
    })

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, data: 'User not found' },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { success: true, data, totalData },
      { status: 200 },
    )
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
