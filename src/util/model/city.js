import mongoose from "mongoose"

const cityModel = new mongoose.Schema({
  name: String,
  pinCode: Number,
  stateTin: Number,
  stateCode: String,
  countryPhoneCode: Number,
})
export const City = mongoose.models.cities || mongoose.model("cities", cityModel)
