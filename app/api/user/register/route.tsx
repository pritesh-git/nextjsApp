import db from '@/config/db'
import { allowedFields } from '@/shared/interfaces/enums'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const userData = await request.json()

    // Check if all required fields are provided
    const requiredFields = allowedFields
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 },
        )
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    // Query to insert user into the database
    const query = `
      INSERT INTO users 
      (first_name, last_name, email, password, bio, about_me, hobbies, profile_pic, is_active, created_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    // Execute the query with user data
    try {
      await db.query(query, [
        userData.first_name,
        userData.last_name,
        userData.email,
        hashedPassword,
        userData.bio || null,
        userData.about_me || null,
        userData.hobbies || null,
        userData.profile_pic || null,
        userData.is_active || 1,
        new Date().toISOString(),
      ])

      // Return success response
      return NextResponse.json(
        { success: true, message: 'User registered successfully' },
        { status: 201 },
      )
    } catch (error) {
      console.error('Error executing query:', error)
      return NextResponse.json(
        { success: false, message: 'Error registering user' },
        { status: 500 },
      )
    }
  } catch (error: any) {
    // Handle any errors
    console.error('Error registering user:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error registering user',
      },
      { status: 500 },
    )
  }
}
