import db from '@/config/db'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const userData = await request.json()

    // Check if all required fields are provided
    const requiredFields = ['first_name', 'last_name', 'email', 'password']
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 },
        )
      }
    }

    // Query to insert user into the database
    const query = `INSERT INTO users (first_name, last_name, email, password, bio, about_me, hobbies, profile_pic, is_active, created_date) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

    // Execute the query with user data
    await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          userData.first_name,
          userData.last_name,
          userData.email,
          userData.password,
          userData.bio || null,
          userData.about_me || null,
          userData.hobbies || null,
          userData.profile_pic || null,
          userData.is_active || 1,
          new Date().toISOString(),
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
      { success: true, message: 'User registered successfully' },
      { status: 201 },
    )
  } catch (error: any) {
    // Handle any errors
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Error registering user',
      },
      { status: 500 },
    )
  }
}
