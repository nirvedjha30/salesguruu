import { connectionStr } from "@/lib/db"
import { SuperAdmin } from "@/util/model/superAdmin"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function GET() {
  let data = []
  let success = true
  try {
    await mongoose.connect(connectionStr)
    data = await SuperAdmin.find()
  } catch (error) {
    data = { result: "error" }
    success = false
  }
  return NextResponse.json({ result: data, success })
}

export async function POST(request) {
  const payload = await request.json()
  console.log(payload.email);
  const record = { email: payload.email, role: payload.role }
  const mobileNumberRecord = { mobileNumber: payload.mobileNumber, role: payload.role }
  await mongoose.connect(connectionStr)
  const findRecord = await SuperAdmin.findOne(record)
  const findMobileNumberRecord = await SuperAdmin.findOne(mobileNumberRecord)
  if (findRecord) {
    return NextResponse.json(
      { result: "request user is already register", userAlreadyRegister: true, success: false },
      { status: 400 }
    )
  }
  if (findMobileNumberRecord) {
    return NextResponse.json(
      { result: "request user mobile number is already register", userMobileNumberAlreadyRegister: true, success: false },
      { status: 400 }
    )
  }
  let superAdmin = new SuperAdmin(payload)
  if (
    !superAdmin.name ||
    !superAdmin.email ||
    !superAdmin.password ||
    !superAdmin.role ||
    !superAdmin.companyName ||
    !superAdmin.address ||
    !superAdmin.countryName ||
    !superAdmin.stateName ||
    !superAdmin.cityName ||
    !superAdmin.mobileNumber
  ) {
    return NextResponse.json(
      { result: "request data is not valid", success: false },
      { status: 400 }
    )
  }
  const result = await superAdmin.save()
  return NextResponse.json({ result, success: true })
}
