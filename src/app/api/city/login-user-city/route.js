import { connectionStr } from "@/lib/db"
import { City } from "@/util/model/city"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function POST(request) {
  const payload = await request.json()
  const record = { name: payload.cityName }
  await mongoose.connect(connectionStr)
  const result = await City.findOne(record)
  if (result) {
    return NextResponse.json({ result, success: true })
  } else {
    return NextResponse.json({ result, success: false })
  }
}
