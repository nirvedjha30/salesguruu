"use client"
import { useState } from "react"
import "../../styles/registration.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Select from "@/components/Select"

const { NEXT_PUBLIC_url } = process.env

export default function Page() {
  const regex = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$" //email validation regular expression

  // ========================================================
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rePassword, setRePassword] = useState("")
  const [role, setRole] = useState("Super Admin")
  const [companyName, setCompanyName] = useState("")
  const [address, setAddress] = useState("")
  const [countryName, setCountryName] = useState("")
  const [stateName, setStateName] = useState("")
  const [cityName, setCityName] = useState("")
  const [mobileNumber, setMobileNumber] = useState()
  // ========================================================

  // ========================================================
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [rePasswordError, setRePasswordError] = useState("")
  const [companyNameError, setCompanyNameError] = useState("")
  const [addressError, setAddressError] = useState("")
  const [countryNameError, setCountryNameError] = useState("")
  const [stateNameError, setStateNameError] = useState("")
  const [cityNameError, setCityNameError] = useState("")
  const [mobileNumberError, setMobileNumberError] = useState()
  // ========================================================

  const router = useRouter()

  const signUp = async (e) => {
    e.preventDefault()
    if (
      !name ||
      !email ||
      !email.match(regex) ||
      !password ||
      password.length <= 6 ||
      !rePassword ||
      password != rePassword ||
      !address ||
      !companyName ||
      !stateName ||
      !countryName ||
      !cityName ||
      !mobileNumber ||
      mobileNumber.toString().length != 10
    ) {
      handle()
    } else {
      if (password == rePassword) {
        let result = await fetch(`${NEXT_PUBLIC_url}/api/super-admin`, {
          method: "POST",
          body: JSON.stringify({
            name,
            email,
            password,
            role,
            companyName,
            address,
            countryName,
            stateName,
            cityName,
            mobileNumber,
          }),
        })
        result = await result.json()
        if (result.userAlreadyRegister == true) {
          alert("User is already register")
        }else if (result.userMobileNumberAlreadyRegister == true) {
          alert("User mobile number is already register")
        } else if (result.success) {
          alert("New Super Admin Added")
          router.push("/")
        } else {
          alert("Please Enter all field")
        }
      } else {
        alert("Please Enter Same Password")
      }
    }
  }

  // ====================================================

  const handle = () => {
    if (!name) {
      setNameError("Please enter name.")
    } else {
      setNameError("")
    }
    if (!email) {
      setEmailError("Please enter email address.")
    } else if (!email.match(regex)) {
      setEmailError("Please enter valid email address.")
    } else {
      setEmailError("")
    }
    if (!password) {
      setPasswordError("Please enter password.")
    } else if (password.length <= 6) {
      setPasswordError("Please enter more then 6 character password.")
    } else {
      setPasswordError("")
    }
    if (!rePassword) {
      setRePasswordError("Please enter re-password.")
    } else if (password != rePassword) {
      setRePasswordError("Please enter same password.")
    } else {
      setRePasswordError("")
    }
    if (!address) {
      setAddressError("Please enter address.")
    } else {
      setAddressError("")
    }
    if (!companyName) {
      setCompanyNameError("Please enter company name.")
    } else {
      setCompanyNameError("")
    }
    if (!stateName) {
      setStateNameError("Please enter state name.")
    } else {
      setStateNameError("")
    }
    if (!countryName) {
      setCountryNameError("Please enter country name.")
    } else {
      setCountryNameError("")
    }
    if (!cityName) {
      setCityNameError("Please enter city name.")
    } else {
      setCityNameError("")
    }
    if (!mobileNumber) {
      setMobileNumberError("Please enter mobile number.")
    } else if (mobileNumber.toString().length != 10) {
      setMobileNumberError("Please enter valid mobile number.")
    } else {
      setMobileNumberError("")
    }
  }

  const handler = (e) => {
    if (e.target.id == "name") {
      setName(e.target.value)
      if (e.target.value.length == 0) {
        setNameError("Please enter name.")
      } else {
        setNameError("")
      }
    }
    if (e.target.id == "email") {
      setEmail(e.target.value)
      if (e.target.value.length == 0) {
        setEmailError("Please enter email address.")
      } else if (!e.target.value.match(regex)) {
        setEmailError("Please enter valid email address.")
      } else {
        setEmailError("")
      }
    }
    if (e.target.id == "password") {
      setPassword(e.target.value)
      if (e.target.value.length == 0) {
        setPasswordError("Please enter password.")
      } else if (e.target.value.length <= 6) {
        setPasswordError("Please enter more then 6 character password.")
        if (rePassword == 0) {
        } else if (e.target.value != rePassword) {
          setRePasswordError("Please enter same password.")
        } else {
          setRePasswordError("")
        }
      } else if (e.target.value.length > 6) {
        setPasswordError("")
        if (rePassword == 0) {
        } else if (e.target.value != rePassword) {
          setRePasswordError("Please enter same password.")
        } else {
          setRePasswordError("")
        }
      }
    }
    if (e.target.id == "re-password") {
      setRePassword(e.target.value)
      if (e.target.value.length == 0) {
        setRePasswordError("Please enter re-password.")
      } else if (e.target.value != password) {
        setRePasswordError("Please enter same password.")
      } else {
        setRePasswordError("")
      }
    }
    if (e.target.id == "address") {
      setAddress(e.target.value)
      if (e.target.value.length == 0) {
        setAddressError("Please enter address.")
      } else {
        setAddressError("")
      }
    }
    if (e.target.id == "company-name") {
      setCompanyName(e.target.value)
      if (e.target.value.length == 0) {
        setCompanyNameError("Please enter company name.")
      } else {
        setCompanyNameError("")
      }
    }
    if (e.target.id == "state-name") {
      setStateName(e.target.value)
      if (e.target.value.length == 0) {
        setStateNameError("Please select state.")
      } else {
        setStateNameError("")
      }
    }
    if (e.target.id == "country-name") {
      setCountryName(e.target.value)
      if (e.target.value.length == 0) {
        setCountryNameError("Please select country.")
      } else {
        setCountryNameError("")
      }
    }
    if (e.target.id == "city-name") {
      setCityName(e.target.value)
      if (e.target.value.length == 0) {
        setCityNameError("Please select city.")
      } else {
        setCityNameError("")
      }
    }
    if (e.target.id == "mobile-number") {
      setMobileNumber(e.target.value)
      if (e.target.value.toString().length == 0) {
        setMobileNumberError("Please enter mobile number.")
      } else if (e.target.value.toString().length != 10) {
        setMobileNumberError("Please enter valid mobile number.")
      } else {
        setMobileNumberError("")
      }
    }
  }

  return (
    <div className="registration">
      <div className="registrationFormSection">
        <div className="registrationFormInnerSection">
          <div className="registrationForm">
            <h1>Sign up</h1>
            <form>
              <div className="field">
                <div className="fieldOne">
                  <table>
                    <tbody>
                      <tr className="input">
                        <td className="inputLabel">
                          <label>Username:</label>
                        </td>
                        <td className="inputFiled">
                          <input
                            type="text"
                            className={nameError && "errorBorder"}
                            id="name"
                            value={name}
                            onChange={(e) => handler(e)}
                            placeholder="Enter a name"
                          />
                          {nameError && <p className="errorMsg">{nameError}</p>}
                        </td>
                      </tr>
                      <tr className="input">
                        <td className="inputLabel">
                          <label>Password:</label>
                        </td>
                        <td className="inputFiled">
                          <input
                            type="password"
                            className={passwordError && "errorBorder"}
                            id="password"
                            value={password}
                            onChange={(e) => handler(e)}
                            placeholder="Enter a password"
                          />
                          {passwordError && <p className="errorMsg">{passwordError}</p>}
                        </td>
                      </tr>
                      <tr className="input">
                        <td className="inputLabel">
                          <label>Address:</label>
                        </td>
                        <td className="inputFiled">
                          <input
                            type="text"
                            className={addressError && "errorBorder"}
                            id="address"
                            value={address}
                            onChange={(e) => handler(e)}
                            placeholder="Enter a address"
                          />
                          {addressError && <p className="errorMsg">{addressError}</p>}
                        </td>
                      </tr>
                      <tr className="input">
                        <td className="inputLabel">
                          <label>State:</label>
                        </td>
                        <td className="inputFiled">
                          <Select
                            value="states"
                            id="state-name"
                            handler={handler}
                            stateNameError={stateNameError}
                            stateName={stateName}
                            setStateName={setStateName}
                          />
                          {stateNameError && <p className="errorMsg">{stateNameError}</p>}
                        </td>
                      </tr>
                      <tr className="input">
                        <td className="inputLabel">
                          <label>City:</label>
                        </td>
                        <td className="inputFiled">
                          <Select
                            value="cities"
                            id="city-name"
                            handler={handler}
                            cityNameError={cityNameError}
                            cityName={cityName}
                            setCityName={setCityName}
                          />
                          {cityNameError && <p className="errorMsg">{cityNameError}</p>}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <table>
                    <tbody>
                      <tr className="input">
                        <td className="inputLabel">
                          <label>email:</label>
                        </td>
                        <td className="inputFiled">
                          <input
                            type="text"
                            className={emailError && "errorBorder"}
                            id="email"
                            value={email}
                            onChange={(e) => handler(e)}
                            placeholder="Enter a vendor email"
                          />
                          {emailError && <p className="errorMsg">{emailError}</p>}
                        </td>
                      </tr>
                      <tr className="input">
                        <td className="inputLabel">
                          <label>Re-Password:</label>
                        </td>
                        <td className="inputFiled">
                          <input
                            type="password"
                            className={rePasswordError && "errorBorder"}
                            id="re-password"
                            value={rePassword}
                            onChange={(e) => handler(e)}
                            placeholder="Enter a password"
                          />
                          {rePasswordError && <p className="errorMsg">{rePasswordError}</p>}
                        </td>
                      </tr>
                      <tr className="input">
                        <td className="inputLabel">
                          <label>Company Name:</label>
                        </td>
                        <td className="inputFiled">
                          <input
                            type="text"
                            className={companyNameError && "errorBorder"}
                            id="company-name"
                            value={companyName}
                            onChange={(e) => handler(e)}
                            placeholder="Enter a company name"
                          />
                          {companyNameError && <p className="errorMsg">{companyNameError}</p>}
                        </td>
                      </tr>
                      <tr className="input">
                        <td className="inputLabel">
                          <label>Country:</label>
                        </td>
                        <td className="inputFiled">
                          <Select
                            value="countries"
                            id="country-name"
                            handler={handler}
                            countryNameError={countryNameError}
                            countryName={countryName}
                            setCountryName={setCountryName}
                          />
                          {countryNameError && <p className="errorMsg">{countryNameError}</p>}
                        </td>
                      </tr>
                      <tr className="input">
                        <td className="inputLabel">
                          <label>Number:</label>
                        </td>
                        <td className="inputFiled">
                          <input
                            type="number"
                            className={mobileNumberError && "errorBorder"}
                            id="mobile-number"
                            value={mobileNumber}
                            onChange={(e) => handler(e)}
                            placeholder="Enter a mobile number"
                          />
                          {mobileNumberError && <p className="errorMsg">{mobileNumberError}</p>}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="forgotPassword">
                <Link href="/">Login</Link>
              </div>
              <button type="submit" onClick={(e) => signUp(e)} className="registrationBtn">
                Signup
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
