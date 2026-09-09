import { NextResponse } from 'next/server'

// This route silences 404 spam from browser extensions that poll /messages
export async function GET() {
  return NextResponse.json({ messages: [] }, { status: 200 })
}
