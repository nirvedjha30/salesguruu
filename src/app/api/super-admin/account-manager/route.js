import { connectionStr } from "@/lib/db"
import { SuperAdmin } from "@/util/model/superAdmin"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function GET() {
  let data = []
  let success = true
  const record = { role: "Account Manager" }
  try {
    await mongoose.connect(connectionStr)
    data = await SuperAdmin.find(record)
  } catch (error) {
    data = { result: "error" }
    success = false
  }
  return NextResponse.json({ result: data, success })
}

export async function POST(request) {
  const payload = await request.json()
  const loginUserRole = payload.loginUserRole
  const record = { email: payload.email, role: payload.role }
  const mobileNumberRecord = { mobileNumber: payload.mobileNumber, role: payload.role }
  await mongoose.connect(connectionStr)
  const findRecord = await SuperAdmin.findOne(record)
  const findMobileNumberRecord = await SuperAdmin.findOne(mobileNumberRecord)
  if (loginUserRole != "Super Admin") {
    return NextResponse.json(
      { result: "request user role is not valid", invalidRole: false, success: false },
      { status: 400 }
    )
  }
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
  let accountManager = new SuperAdmin(payload)
  if (
    !accountManager.name ||
    !accountManager.email ||
    !accountManager.password ||
    !accountManager.role ||
    !accountManager.companyName ||
    !accountManager.address ||
    !accountManager.countryName ||
    !accountManager.stateName ||
    !accountManager.cityName ||
    !accountManager.mobileNumber
  ) {
    return NextResponse.json(
      { result: "request data is not valid", success: false },
      { status: 400 }
    )
  }
  const result = await accountManager.save()
  return NextResponse.json({ result, success: true })
}
