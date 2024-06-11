import { connectionStr } from "@/lib/db"
import { Category } from "@/util/model/category"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function GET() {
  let data = []
  let success = true
  try {
    await mongoose.connect(connectionStr)
    data = await Category.find()
  } catch (error) {
    data = { result: "error" }
    success = false
  }
  return NextResponse.json({ result: data, success })
}

export async function POST(request) {
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
  let category = new Category(payload)
  if (!category.categoryName || !category.categoryDescription) {
    return NextResponse.json(
      { result: "request data is not valid", success: false },
      { status: 400 }
    )
  }
  const result = await category.save()
  return NextResponse.json({ result, success: true })
}
