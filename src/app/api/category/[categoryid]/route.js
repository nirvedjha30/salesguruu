import { connectionStr } from "@/lib/db"
import { Category } from "@/util/model/category"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function PUT(request, content) {
  const categoryId = content.params.categoryid
  const filter = { _id: categoryId }
  const payload = await request.json()
  const loginUserRole = payload.loginUserRole
  await mongoose.connect(connectionStr)
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
  if (!payload.categoryName || !payload.categoryDescription) {
    return NextResponse.json(
      { result: "request data is not valid", success: false },
      { status: 400 }
    )
  }
  const result = await Category.findOneAndUpdate(filter, payload)
  return NextResponse.json({ result, success: true })
}

export async function GET(request, content) {
  const categoryId = content.params.categoryid
  const record = { _id: categoryId }
  await mongoose.connect(connectionStr)
  const result = await Category.findById(record)
  return NextResponse.json({ result, success: true })
}

export async function DELETE(request, content) {
  const categoryId = content.params.categoryid
  const record = { _id: categoryId }
  const payload = await request.json()
  const loginUserRole = payload.loginUserRole
  await mongoose.connect(connectionStr)
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
  const result = await Category.deleteOne(record)
  return NextResponse.json({ result, success: true })
}
