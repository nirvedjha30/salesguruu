import { connectionStr } from "@/lib/db"
import { Product } from "@/util/model/product"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function PUT(request, content) {
  const productId = content.params.productid
  const filter = { _id: productId }
  const payload = await request.json()
  const loginUserRole = payload.loginUserRole
  const loginUserEmail = payload.loginUserEmail
  const record = { _id: productId, vendorId: loginUserEmail }
  await mongoose.connect(connectionStr)
  const findRecord = await Product.findOne(record)
  if (loginUserRole != "Super Admin" && loginUserRole != "Vendor") {
    return NextResponse.json(
      { result: "request user role is not valid", invalidRole: false, success: false },
      { status: 400 }
    )
  }
  if (loginUserRole == "Vendor" && !findRecord) {
    return NextResponse.json(
      { return: "request user is not valid", invalidUser: false, success: false },
      { status: 400 }
    )
  }
  if (
    !payload.name ||
    !payload.price ||
    !payload.productDescription ||
    !payload.quantity ||
    !payload.vendorId ||
    !payload.category
  ) {
    return NextResponse.json(
      { result: "request data is not valid", success: false },
      { status: 400 }
    )
  }
  const result = await Product.findOneAndUpdate(filter, payload)
  return NextResponse.json({ result, success: true })
}

export async function GET(request, content) {
  const productId = content.params.productid
  const record = { _id: productId }
  await mongoose.connect(connectionStr)
  const result = await Product.findById(record)
  return NextResponse.json({ result, success: true })
}

export async function DELETE(request, content) {
  const productId = content.params.productid
  const delRecord = { _id: productId }
  const payload = await request.json()
  const loginUserRole = payload.loginUserRole
  const loginUserEmail = payload.loginUserEmail
  const record = { _id: productId, vendorId: loginUserEmail }
  await mongoose.connect(connectionStr)
  const findRecord = await Product.findOne(record)
  if (loginUserRole != "Super Admin" && loginUserRole != "Vendor") {
    return NextResponse.json(
      { result: "request user role is not valid", invalidRole: false, success: false },
      { status: 400 }
    )
  }
  if (loginUserRole == "Vendor" && !findRecord) {
    return NextResponse.json(
      { return: "request user is not valid", invalidUser: false, success: false },
      { status: 400 }
    )
  }
  const result = await Product.deleteOne(delRecord)
  return NextResponse.json({ result, success: true })
}
