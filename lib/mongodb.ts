import mongoose from 'mongoose'

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
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI environment variable is not defined')
  if (cached.conn) return cached.conn
  cached.promise ??= mongoose.connect(uri)
  cached.conn = await cached.promise
  return cached.conn
}
