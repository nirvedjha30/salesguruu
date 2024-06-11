import mongoose from "mongoose"

const productModel = new mongoose.Schema({
  name: String,
  price: Number,
  productDescription: String,
  quantity: Number,
  vendorId: String,
  category: String,
})
export const Product = mongoose.models.products || mongoose.model("products", productModel)
