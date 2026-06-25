import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Meeting from '@/models/Meeting'

export const dynamic = 'force-dynamic'

export async function GET() {
  await connectDB()
  const meeting = await Meeting.findOne({ isActive: true }).lean()
  return NextResponse.json(meeting ?? null, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
