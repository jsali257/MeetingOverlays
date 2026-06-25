import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Meeting from '@/models/Meeting'

export const dynamic = 'force-dynamic'

export async function GET() {
  await connectDB()
  const meetings = await Meeting.find().sort({ createdAt: -1 }).lean()
  return NextResponse.json(meetings)
}

export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()
  const meeting = await Meeting.create(body)
  return NextResponse.json(meeting, { status: 201 })
}
