import { NextResponse } from 'next/server'

function createErrorResponse() {
  return NextResponse.json(
    {
      success: false,
      message: '404 Not Found: The requested URL does not exist on the server',
    },
    { status: 404 },
  )
}

export const GET = () => createErrorResponse()
export const POST = () => createErrorResponse()
export const PUT = () => createErrorResponse()
export const DELETE = () => createErrorResponse()
