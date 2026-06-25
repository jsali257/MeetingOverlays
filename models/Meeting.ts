import mongoose, { Schema, model, models, Document } from 'mongoose'

export interface AgendaItem {
  id: string
  text: string
  isActive: boolean
  isCompleted: boolean
}

export interface IMeeting extends Document {
  title: string
  date: string
  organization: string
  agendaItems: AgendaItem[]
  isActive: boolean
  execSessionImageUrl: string
  createdAt: Date
  updatedAt: Date
}

const agendaItemSchema = new Schema<AgendaItem>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
  },
  { _id: false }
)

const meetingSchema = new Schema<IMeeting>(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    organization: { type: String, default: 'RGV911' },
    agendaItems: { type: [agendaItemSchema], default: [] },
    isActive: { type: Boolean, default: false },
    execSessionImageUrl: { type: String, default: '' },
  },
  { timestamps: true }
)

export default models.Meeting ?? model<IMeeting>('Meeting', meetingSchema)
