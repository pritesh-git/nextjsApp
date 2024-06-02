import db from '@/config/db'
import bcrypt from 'bcryptjs'
import { isEmpty, omit } from 'lodash'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const { email, password } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 },
      )
    }

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'Password is required' },
        { status: 400 },
      )
    }

    const query = 'SELECT * FROM users WHERE email = ?'
    const [user]: any = await db.query(query, [email])

    if (isEmpty(user)) {
      return NextResponse.json(
        { success: false, message: 'Email not found' },
        { status: 401 },
      )
    }

    const isPasswordValid =
      (await bcrypt.compare(password, user[0].password)) ||
      password === user[0].password
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 },
      )
    }
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: omit(user[0], 'password'),
      },
      { status: 200 },
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Error during login process',
      },
      { status: 500 },
    )
  }
}
