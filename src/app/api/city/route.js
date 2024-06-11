import { connectionStr } from "@/lib/db"
import { City } from "@/util/model/city"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function GET() {
  let data = []
  let success = true
  try {
    await mongoose.connect(connectionStr)
    data = await City.find()
  } catch (error) {
    data = { result: "error" }
    success = false
  }
  return NextResponse.json({ result: data, success })
}
