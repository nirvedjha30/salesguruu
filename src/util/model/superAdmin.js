import mongoose from "mongoose"

const superAdminModel = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  companyName: String,
  address: String,
  countryName: String,
  stateName: String,
  cityName: String,
  mobileNumber: Number,
})
export const SuperAdmin =
  mongoose.models.superadmins || mongoose.model("superadmins", superAdminModel)
