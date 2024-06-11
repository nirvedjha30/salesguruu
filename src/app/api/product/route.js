import { connectionStr } from "@/lib/db"
import { Product } from "@/util/model/product"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function GET() {
  let data = []
  let success = true
  try {
    await mongoose.connect(connectionStr)
    data = await Product.find()
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
  if (loginUserRole != "Super Admin" && loginUserRole != "Vendor") {
    return NextResponse.json(
      { result: "request user role is not valid", invalidRole: false, success: false },
      { status: 400 }
    )
  }
  let product = new Product(payload)
  if (
    !product.name ||
    !product.price ||
    !product.productDescription ||
    !product.quantity ||
    !product.vendorId ||
    !product.category
  ) {
    return NextResponse.json(
      { result: "request data is not valid", success: false },
      { status: 400 }
    )
  }
  const result = await product.save()
  return NextResponse.json({ result, success: true })
}
