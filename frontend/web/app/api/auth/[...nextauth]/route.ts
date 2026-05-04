import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ authenticated: false })
}

export async function POST() {
  return NextResponse.json(
    { error: 'Authentication provider is not configured.' },
    { status: 501 }
  )
}
