import db from '@/config/db'
import { UserType } from '@/shared/interfaces/types'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (context: any) => {
  try {
    const {
      params: { id },
    } = context

    // Check if user ID is provided
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 },
      )
    }

    // Query to fetch user by ID
    const query = `SELECT id, first_name, last_name, email, bio, about_me, hobbies, profile_pic, is_active, created_date FROM users WHERE id = ?`

    // Execute the query with user ID
    const user: UserType[] = await new Promise((resolve, reject) => {
      db.query(query, [id], (err: any, results: UserType[]) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })

    // Check if user exists
    if (user.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 },
      )
    }

    // Return the user data
    return NextResponse.json({ success: true, data: user }, { status: 200 })
  } catch (error: any) {
    // Handle any errors
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
    const userData = await request.json()

    // Query to update user by ID
    const query = `UPDATE users 
                   SET first_name = ?, last_name = ?, email = ?, bio = ?, about_me = ?, hobbies = ?, profile_pic = ?, is_active = ? 
                   WHERE id = ?`

    // Execute the query with user data and ID
    await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          userData.first_name,
          userData.last_name,
          userData.email,
          userData.bio,
          userData.about_me,
          userData.hobbies,
          userData.profile_pic,
          userData.is_active,
          id,
        ],
        (err: any) => {
          if (err) {
            reject(err)
          } else {
            resolve('success')
          }
        },
      )
    })

    // Return success response
    return NextResponse.json(
      { success: true, message: 'User updated successfully' },
      { status: 200 },
    )
  } catch (error: any) {
    // Handle any errors
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Error updating user data',
      },
      { status: 500 },
    )
  }
}
