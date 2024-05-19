import db from '@/config/db'
import { UserType } from '@/shared/interfaces/types'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    const queryParams: any = {}
    const filters = []
    let sortingBy = 'created_date'
    let sortingOrder: 'asc' | 'desc' = 'asc'
    let dataLimit = 10
    request.nextUrl.searchParams.forEach((value, key) => {
      queryParams[key] = value
    })

    if (queryParams) {
      const { limit, sortOrder, sortBy, first_name, email } = queryParams

      if (limit) {
        dataLimit = parseInt(limit, 10)
      }
      if (sortOrder && (sortOrder === 'asc' || sortOrder === 'desc')) {
        sortingOrder = sortOrder
      }
      if (sortBy) {
        sortingBy = sortBy
      }
      if (first_name) {
        filters.push(`first_name LIKE '%${first_name}%'`)
      }
      if (email) {
        filters.push(`email LIKE '%${email}%'`)
      }
    }

    const whereClause =
      filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : ''
    const query = `SELECT id, first_name, last_name, email, bio, about_me, hobbies, profile_pic, is_active, created_date FROM users ${whereClause} ORDER BY ${sortingBy} ${sortingOrder} LIMIT ${dataLimit}`
    const countQuery = `SELECT COUNT(*) AS total_data FROM users ${whereClause}`

    const result: UserType[] = await new Promise((resolve, reject) => {
      db.query(query, (err: any, results: []) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
    const totalData: { total_data: string }[] = await new Promise(
      (resolve, reject) => {
        db.query(countQuery, (err: any, results: []) => {
          if (err) {
            reject(err)
          } else {
            resolve(results)
          }
        })
      },
    )

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, data: 'User not found' },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { success: true, data: result, total: totalData[0].total_data },
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
