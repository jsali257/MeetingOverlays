import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Meeting from '@/models/Meeting'

type Ctx = { params: { id: string } }

export async function GET(_: NextRequest, { params }: Ctx) {
  await connectDB()
  const meeting = await Meeting.findById(params.id).lean()
  if (!meeting) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(meeting)
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  await connectDB()
  const body = await req.json()

  if (body.isActive === true) {
    await Meeting.updateMany({ _id: { $ne: params.id } }, { $set: { isActive: false } })
  }

  const meeting = await Meeting.findByIdAndUpdate(
    params.id,
    { $set: body },
    { new: true }
  ).lean()

  if (!meeting) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(meeting)
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  await connectDB()
  await Meeting.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}
