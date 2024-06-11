import mongoose from "mongoose"

const employeeModel = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  superAdminId: String,
  role: String,
  mobileNumber: Number,
  gender: String,
  status: String,
})
export const Employee = mongoose.models.employees || mongoose.model("employees", employeeModel)
