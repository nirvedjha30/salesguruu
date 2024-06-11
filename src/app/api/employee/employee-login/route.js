import { connectionStr } from "@/lib/db"
import { Employee } from "@/util/model/employees"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function POST(request) {
  const payload = await request.json()
  const record = { email: payload.email, password: payload.password, role: payload.role }
  await mongoose.connect(connectionStr)
  const result = await Employee.findOne(record)
  console.log("employee result",result)
  if (result) {
    return NextResponse.json({ result, success: true })
  } else {
    return NextResponse.json({ result, success: false })
  }
}
