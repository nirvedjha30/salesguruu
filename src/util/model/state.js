import mongoose from "mongoose"

const stateModel = new mongoose.Schema({
  name: String,
  tin: Number,
  stateCode: String,
  countryPhoneCode: Number,
})
export const State = mongoose.models.states || mongoose.model("states", stateModel)
