import { connectionStr } from "@/lib/db"
import { Employee } from "@/util/model/employees"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function PUT(request, content) {
  const employeeId = content.params.employeeid
  const filter = { _id: employeeId }
  const payload = await request.json()
  const loginUserRole = payload.loginUserRole
  const loginUserId = payload.loginUserId
  const currentEmployeeId = payload.id
  const record = { email: payload.email, role: payload.role }
  const mobileNumberRecord = { mobileNumber: payload.mobileNumber, role: payload.role }
  await mongoose.connect(connectionStr)
  const findRecord = await Employee.findOne(record)
  const findMobileNumberRecord = await Employee.findOne(mobileNumberRecord)
  if (
    loginUserRole != "Super Admin" &&
    loginUserRole != "Account Manager" &&
    loginUserRole != "Vendor" &&
    loginUserRole != "Employee"
  ) {
    return NextResponse.json(
      { result: "request user role is not valid", invalidRole: false, success: false },
      { status: 400 }
    )
  }
  if (loginUserRole == "Employee" && loginUserId != currentEmployeeId) {
    return NextResponse.json(
      { return: "request user is not valid", invalidUser: false, success: false },
      { status: 400 }
    )
  }
  if (findRecord && payload.id!=findRecord._id) {
    return NextResponse.json(
      { result: "request user is already register", userAlreadyRegister: true, success: false },
      { status: 400 }
    )
  }
  if (findMobileNumberRecord && payload.id!=findMobileNumberRecord._id) {
    return NextResponse.json(
      { result: "request user mobile number is already register", userMobileNumberAlreadyRegister: true, success: false },
      { status: 400 }
    )
  }
  if (
    !payload.name ||
    !payload.email ||
    !payload.password ||
    // !payload.superAdminId ||
    !payload.role ||
    !payload.mobileNumber ||
    !payload.gender ||
    !payload.status
  ) {
    return NextResponse.json(
      { result: "request data is not valid", success: false },
      { status: 400 }
    )
  }
  const result = await Employee.findOneAndUpdate(filter, payload)
  return NextResponse.json({ result, success: true })
}

export async function GET(request, content) {
  let data = []
  let success = true
  const employeeId = content.params.employeeid
  const record = { role: "Employee", _id: employeeId }
  try {
    await mongoose.connect(connectionStr)
    data = await Employee.find(record)
  } catch (error) {
    data = { result: "error" }
    success = false
  }
  return NextResponse.json({ result: data, success })
}

export async function DELETE(request, content) {
  const employeeId = content.params.employeeid
  const record = { _id: employeeId }
  const payload = await request.json()
  const loginUserRole = payload.loginUserRole
  const loginUserId = payload.loginUserId
  await mongoose.connect(connectionStr)
  if (
    loginUserRole != "Super Admin" &&
    loginUserRole != "Account Manager" &&
    loginUserRole != "Vendor" &&
    loginUserRole != "Employee"
  ) {
    return NextResponse.json(
      { result: "request user role is not valid", invalidRole: false, success: false },
      { status: 400 }
    )
  }
  if (loginUserRole == "Employee" && loginUserId != employeeId) {
    return NextResponse.json(
      { result: "request user is not valid", invalidUser: false, success: false },
      { status: 400 }
    )
  }
  const result = await Employee.deleteOne(record)
  return NextResponse.json({ result, success: true })
}
