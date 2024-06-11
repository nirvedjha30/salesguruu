import { connectionStr } from "@/lib/db"
import { Employee } from "@/util/model/employees"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function GET() {
  let data = []
  let success = true
  try {
    await mongoose.connect(connectionStr)
    data = await Employee.find()
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
  const findRecord = await Employee.findOne(record)
  const findMobileNumberRecord = await Employee.findOne(mobileNumberRecord)
  if (
    loginUserRole != "Super Admin" &&
    loginUserRole != "Account Manager" &&
    loginUserRole != "Vendor"
  ) {
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
  let employee = new Employee(payload)
  if (
    !employee.name ||
    !employee.email ||
    !employee.password ||
    !employee.superAdminId ||
    !employee.role ||
    !employee.mobileNumber ||
    !employee.gender ||
    !employee.status
  ) {
    return NextResponse.json(
      { result: "request data is not valid", success: false },
      { status: 400 }
    )
  }
  const result = await employee.save()
  return NextResponse.json({ result, success: true })
}
