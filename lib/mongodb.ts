import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined')
}

interface GlobalMongoose {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: GlobalMongoose
}

const cached: GlobalMongoose = global._mongoose ?? { conn: null, promise: null }
global._mongoose = cached

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn
  cached.promise ??= mongoose.connect(MONGODB_URI)
  cached.conn = await cached.promise
  return cached.conn
}
