import { connectionStr } from "@/lib/db"
import { SuperAdmin } from "@/util/model/superAdmin"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function PUT(request, content) {
  const accountManagerId = content.params.accountmanagerid
  const filter = { _id: accountManagerId }
  const payload = await request.json()
  const loginUserRole = payload.loginUserRole
  const loginUserId = payload.loginUserId
  const currentAccountManagerId = payload.id
  const record = { email: payload.email, role: payload.role }
  const mobileNumberRecord = { mobileNumber: payload.mobileNumber, role: payload.role }
  await mongoose.connect(connectionStr)
  const findRecord = await SuperAdmin.findOne(record)
  const findMobileNumberRecord = await SuperAdmin.findOne(mobileNumberRecord)
  if (loginUserRole != "Super Admin" && loginUserRole != "Account Manager") {
    return NextResponse.json(
      { result: "request user role is not valid", invalidRole: false, success: false },
      { status: 400 }
    )
  }
  if (loginUserRole == "Account Manager" && loginUserId != currentAccountManagerId) {
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
    !payload.role ||
    !payload.companyName ||
    !payload.address ||
    !payload.countryName ||
    !payload.stateName ||
    !payload.cityName ||
    !payload.mobileNumber
  ) {
    return NextResponse.json(
      { result: "request data is not valid", success: false },
      { status: 400 }
    )
  }
  const result = await SuperAdmin.findOneAndUpdate(filter, payload)
  return NextResponse.json({ result, success: true })
}

export async function GET(request, content) {
  let data = []
  let success = true
  const accountManagerId = content.params.accountmanagerid
  const record = { role: "Account Manager", _id: accountManagerId }
  try {
    await mongoose.connect(connectionStr)
    data = await SuperAdmin.find(record)
  } catch (error) {
    data = { result: "error" }
    success = false
  }
  return NextResponse.json({ result: data, success })
}

export async function DELETE(request, content) {
  const accountManagerId = content.params.accountmanagerid
  const record = { _id: accountManagerId }
  const payload = await request.json()
  const loginUserRole = payload.loginUserRole
  const loginUserId = payload.loginUserId
  await mongoose.connect(connectionStr)
  if (loginUserRole != "Super Admin" && loginUserRole != "Account Manager") {
    return NextResponse.json(
      { result: "request user role is not valid", invalidRole: false, success: false },
      { status: 400 }
    )
  }
  if (loginUserRole == "Account Manager" && loginUserId != accountManagerId) {
    return NextResponse.json(
      { result: "request user is not valid", invalidUser: false, success: false },
      { status: 400 }
    )
  }
  const result = await SuperAdmin.deleteOne(record)
  return NextResponse.json({ result, success: true })
}
