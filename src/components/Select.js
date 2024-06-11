"use client"
import { useEffect, useState } from "react"
import "../styles/add-modal.css"
import "../styles/registration.css"

const { NEXT_PUBLIC_url } = process.env

export default function Select(props) {
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [categories, setCategories] = useState([])
  const [vendors, setVendors] = useState([])

  useEffect(() => {
    ;(async () => {
      const country = await getCountries()
      setCountries(country)
      const state = await getStates()
      setStates(state)
      const city = await getCities()
      setCities(city)
      const category = await getCategories()
      setCategories(category)
      const vendor = await getVendors()
      setVendors(vendor)
    })()
  }, [])

  const getCountries = async () => {
    let data = await fetch(`${NEXT_PUBLIC_url}/api/country`, { cache: "no-cache" })
    data = await data.json()
    if (data.success) {
      return data.result
    } else {
      return { success: false }
    }
  }

  const getStates = async () => {
    let data = await fetch(`${NEXT_PUBLIC_url}/api/state`, { cache: "no-cache" })
    data = await data.json()
    if (data.success) {
      return data.result
    } else {
      return { success: false }
    }
  }

  const getCities = async () => {
    let data = await fetch(`${NEXT_PUBLIC_url}/api/city`, { cache: "no-cache" })
    data = await data.json()
    if (data.success) {
      return data.result
    } else {
      return { success: false }
    }
  }

  const getCategories = async () => {
    let data = await fetch(`${NEXT_PUBLIC_url}/api/category`, { cache: "no-cache" })
    data = await data.json()
    if (data.success) {
      return data.result
    } else {
      return { success: false }
    }
  }

  const getVendors = async () => {
    let data = await fetch(`${NEXT_PUBLIC_url}/api/super-admin/vendor`, { cache: "no-cache" })
    data = await data.json()
    if (data.success) {
      return data.result
    } else {
      return { success: false }
    }
  }

  return (
    <>
      {props.value == "countries" ? (
        <select
          className={props.countryNameError && "errorBorder"}
          id={props.id}
          value={props.countryName}
          onChange={(e) => {
            props.handler(e)
          }}
          placeholder="Select a Country"
        >
          <option></option>
          {countries != "" ? (
            countries.map((item, index) => (
              <option key={index} value={item.name}>
                {item.name}
              </option>
            ))
          ) : (
            <option>No Country</option>
          )}
        </select>
      ) : props.value == "states" ? (
        <select
          className={props.stateNameError && "errorBorder"}
          id={props.id}
          value={props.stateName}
          onChange={(e) => {
            props.handler(e)
          }}
          placeholder="Select a State"
        >
          <option></option>
          {states != "" ? (
            states.map((item, index) => (
              <option key={index} value={item.name}>
                {item.name}
              </option>
            ))
          ) : (
            <option>No States</option>
          )}
        </select>
      ) : props.value == "cities" ? (
        <select
          className={props.cityNameError && "errorBorder"}
          id={props.id}
          value={props.cityName}
          onChange={(e) => {
            props.handler(e)
          }}
          placeholder="Select a City"
        >
          <option></option>
          {cities != "" ? (
            cities.map((item, index) => (
              <option key={index} value={item.name}>
                {item.name}
              </option>
            ))
          ) : (
            <option>No Cities</option>
          )}
        </select>
      ) : props.value == "categories" ? (
        <select
          className={props.categoryError && "errorBorder"}
          id={props.id}
          value={props.category}
          onChange={(e) => {
            props.handler(e)
          }}
          placeholder="Select a Category"
        >
          <option></option>
          {categories != "" ? (
            categories.map((item, index) => (
              <option key={index} value={item.categoryName}>
                {item.categoryName}
              </option>
            ))
          ) : (
            <option>No Categories</option>
          )}
        </select>
      ) : (
        <select
          className={props.vendorIdError && "errorBorder"}
          id={props.id}
          value={props.vendorId}
          onChange={(e) => {
            props.handler(e)
          }}
          placeholder="Select a Vendor"
        >
          <option></option>
          {vendors != "" ? (
            vendors.map((item, index) => (
              <option key={index} value={item.email}>
                {item.email}
              </option>
            ))
          ) : (
            <option>No Vendors</option>
          )}
        </select>
      )}
    </>
  )
}
