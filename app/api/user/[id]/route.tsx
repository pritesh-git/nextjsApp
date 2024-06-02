import db from '@/config/db'
import { allowedFields } from '@/shared/interfaces/enums'
import { isEmpty } from 'lodash'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (_request: NextRequest, context: any) => {
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
    const [user] = await db.query(query, [id])

    // Check if user exists
    if (isEmpty(user)) {
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

    // Check if user ID is provided
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 },
      )
    }
    if (isEmpty(userData)) {
      return NextResponse.json(
        { success: false, message: 'Please provide non empty json data only' },
        { status: 400 },
      )
    }
    // Check if any fields are provided to update
    if (!Object.keys(userData).some(key => allowedFields.includes(key))) {
      return NextResponse.json(
        { success: false, message: 'Please provide valid fields only' },
        { status: 400 },
      )
    }

    // Constructing SET clause dynamically based on the provided fields
    const setFields = Object.keys(userData)
      .filter(key => allowedFields.includes(key))
      .map(key => `${key} = ?`)
      .join(', ')

    // Values to be updated
    const values = Object.values(userData)
    values.push(id) // Add id for WHERE clause

    // Query to update user by ID
    const query = `
      UPDATE users 
      SET 
        ${setFields}
      WHERE 
        id = ?
    `

    // Execute the query to update user
    const [result]: any = await db.query(query, values)

    // Check if the update was successful
    if (result && result.affectedRows > 0) {
      return NextResponse.json(
        { success: true, message: 'User updated successfully' },
        { status: 200 },
      )
    } else {
      return NextResponse.json(
        { success: false, message: 'User not found or no changes applied' },
        { status: 404 },
      )
    }
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
