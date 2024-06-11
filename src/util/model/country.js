import mongoose from "mongoose"

const countryModel = new mongoose.Schema({
  name: String,
  iso3: String,
  iso2: String,
  phoneCode: Number,
})
export const Country = mongoose.models.countries || mongoose.model("countries", countryModel)
