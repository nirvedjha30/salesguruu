import mongoose from "mongoose"

const categoryModel = new mongoose.Schema({
  categoryName: String,
  categoryDescription: String,
})
export const Category = mongoose.models.categories || mongoose.model("categories", categoryModel)
