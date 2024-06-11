"use client"
import "../../styles/profile.css"
import "../../styles/edit-modal.css"
import EditIcon from "../../../public/edit.svg"
import Image from "next/image"
import Navbar from "@/components/Navebar"
import Sidebar from "@/components/Sidebar"
import Footer from "@/components/Footer"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/Navigation"
import Modal from "@/components/Modal"
import Select from "@/components/Select"
import DeleteLoginUser from "@/components/DeleteLoginUser"
import DeleteEmployee from "@/components/DeleteEmployee"
import ProfilePicture from "../../../public/profile-picture.jpg"

const { NEXT_PUBLIC_url } = process.env

export default function Page() {
  const router = useRouter()

  const regex = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$" //email validation regular expression

  const [id, setId] = useState(localStorage.getItem("id"))
  const [name, setName] = useState(localStorage.getItem("name"))
  const [email, setEmail] = useState(localStorage.getItem("email"))
  const [password, setPassword] = useState(localStorage.getItem("password"))
  // const [rePassword, setRePassword] = useState("")
  const [role, setRole] = useState(localStorage.getItem("role"))
  const [companyName, setCompanyName] = useState(localStorage.getItem("companyName"))
  const [address, setAddress] = useState(localStorage.getItem("address"))
  const [countryName, setCountryName] = useState(localStorage.getItem("countryName"))
  const [stateName, setStateName] = useState(localStorage.getItem("stateName"))
  const [cityName, setCityName] = useState(localStorage.getItem("cityName"))
  const [mobileNumber, setMobileNumber] = useState(localStorage.getItem("mobileNumber"))
  const [gender, setGender] = useState(localStorage.getItem("gender"))
  const [status, setStatus] = useState(localStorage.getItem("status"))
  const [superAdminId, setSuperAdminId] = useState(localStorage.getItem("superAdminId"))

  // ====================================================
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [rePasswordError, setRePasswordError] = useState("")
  const [companyNameError, setCompanyNameError] = useState("")
  const [addressError, setAddressError] = useState("")
  const [countryNameError, setCountryNameError] = useState("")
  const [stateNameError, setStateNameError] = useState("")
  const [cityNameError, setCityNameError] = useState("")
  const [mobileNumberError, setMobileNumberError] = useState("")
  const [genderError, setGenderError] = useState("")
  const [statusError, setStatusError] = useState("")
  // ====================================================

  // ====================================================
  const [loginUserRole, setLoginUserRole] = useState(localStorage.getItem("role"))
  const [loginUserId, setloginUserId] = useState(localStorage.getItem("id"))
  // ====================================================

  const [editShawModal, setEditShowModal] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem("id")) {
      router.push("/")
    } else {
      // getCity()
    }
  }, [])

  const getLoginUserDetail = async () => {
    let loginUserId = id
    let data = await fetch(`${NEXT_PUBLIC_url}/api/super-admin/${loginUserId}`, {
      cache: "no-cache",
    })
    data = await data.json()
    const result = data.result[0]
    if (data.success) {
      localStorage.setItem("id", result._id)
      localStorage.setItem("name", result.name)
      localStorage.setItem("email", result.email)
      localStorage.setItem("password", result.password)
      localStorage.setItem("role", result.role)
      localStorage.setItem("companyName", result.companyName)
      localStorage.setItem("address", result.address)
      localStorage.setItem("countryName", result.countryName)
      localStorage.setItem("stateName", result.stateName)
      localStorage.setItem("cityName", result.cityName)
      localStorage.setItem("mobileNumber", result.mobileNumber)
    }
  }

  const getLoginEmployeeDetail = async () => {
    let employeeId = id
    let data = await fetch(`${NEXT_PUBLIC_url}/api/employee/${employeeId}`, {
      cache: "no-cache",
    })
    data = await data.json()
    const result = data.result[0]
    if (data.success) {
      localStorage.setItem("id", result._id)
      localStorage.setItem("name", result.name)
      localStorage.setItem("email", result.email)
      localStorage.setItem("password", result.password)
      localStorage.setItem("role", result.role)
      localStorage.setItem("mobileNumber", result.mobileNumber)
      localStorage.setItem("gender", result.gender)
      localStorage.setItem("status", result.status)
      localStorage.setItem("superAdminId", result.superAdminId)
      // return data.result
    }
  }

  // ==============================================================
  const editLoginUser = () => {
    setEditShowModal(true)
  }

  const closeBtn = () => {
    setEditShowModal(false)

    setNameError("")
    setEmailError("")
    setPasswordError("")
    // setRePasswordError("")
    setCompanyNameError("")
    setAddressError("")
    setCountryNameError("")
    setStateNameError("")
    setCityNameError("")
    setMobileNumberError("")
    setGenderError("")
    setStatusError("")
  }

  const updateLoginUser = async (e) => {
    e.preventDefault()
    if (
      !name ||
      !email ||
      !email.match(regex) ||
      !password ||
      password.length <= 6 ||
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
      // alert("Update");
      let loginUserId = id
      let data = await fetch(`${NEXT_PUBLIC_url}/api/super-admin/${loginUserId}`, {
        method: "PUT",
        body: JSON.stringify({
          id,
          name,
          email,
          password,
          role,
          companyName,
          address,
          countryName,
          stateName,
          cityName,
          mobileNumber
        }),
      })
      data = await data.json()
      if (data.invalidRole == false) {
        alert("User role is not valid")
      } else if (data.invalidUser == false) {
        alert("User is not valid")
      } else if (data.userAlreadyRegister == true) {
        alert("User email is already register")
      } else if (data.userMobileNumberAlreadyRegister == true) {
        alert("User mobile number is already register")
      } else if (data.success) {
        alert("Profile has been Updated")
        setEditShowModal(false)
        getLoginUserDetail()
      } else {
        alert("Please Enter all field")
      }
    }
  }

  const updateLoginEmployee = async (e) => {
    e.preventDefault()
    if (
      !name ||
      !email ||
      !email.match(regex) ||
      !password ||
      password.length <= 6 ||
      !gender ||
      !mobileNumber ||
      mobileNumber.toString().length != 10 ||
      !status
    ) {
      handle()
    } else {
      let employeeId = id
      let data = await fetch(`${NEXT_PUBLIC_url}/api/employee/${employeeId}`, {
        method: "PUT",
        body: JSON.stringify({
          id,
          name,
          email,
          password,
          // superAdminId,
          role,
          mobileNumber,
          gender,
          status,
          loginUserRole,
          loginUserId,
        }),
      })
      data = await data.json()
      if (data.invalidRole == false) {
        alert("User role is not valid")
      } else if (data.invalidUser == false) {
        alert("User is not valid")
      } else if (data.userAlreadyRegister == true) {
        alert("User is already register")
      } else if (data.userMobileNumberAlreadyRegister == true) {
        alert("User mobile number is already register")
      } else if (data.success) {
        alert("Profile has been Updated")
        setEditShowModal(false)
        getLoginEmployeeDetail()
      } else {
        alert("Please Enter all field")
      }
    }
  }

  // ======================================================

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
    // if (!rePassword) {
    //   setRePasswordError("Please enter re-password.")
    // } else if (password != rePassword) {
    //   setRePasswordError("Please enter same password.")
    // } else {
    //   setRePasswordError("")
    // }
    if (role != "Employee") {
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
    }
    if (!mobileNumber) {
      setMobileNumberError("Please enter mobile number.")
    } else if (mobileNumber.toString().length != 10) {
      setMobileNumberError("Please enter valid mobile number.")
    } else {
      setMobileNumberError("")
    }
    if (!gender) {
      setGenderError("Please select gender.")
    } else {
      setGenderError("")
    }
    if (!status) {
      setStatusError("Please select status.")
    } else {
      setStatusError("")
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
        // if (rePassword == 0) {
        //   // setRePasswordError("")
        // } else if (e.target.value != rePassword) {
        //   setRePasswordError("Please enter same password.")
        // } else {
        //   setRePasswordError("")
        // }
      } else if (e.target.value.length > 6) {
        setPasswordError("")
        // if (rePassword == 0) {
        //   // setRePasswordError("")
        // } else if (e.target.value != rePassword) {
        //   setRePasswordError("Please enter same password.")
        // } else {
        //   setRePasswordError("")
        // }
      }
    }
    // if (e.target.id == "re-password") {
    //   setRePassword(e.target.value)
    //   if (e.target.value.length == 0) {
    //     setRePasswordError("Please enter re-password.")
    //   } else if (e.target.value != password) {
    //     setRePasswordError("Please enter same password.")
    //   } else {
    //     setRePasswordError("")
    //   }
    // }
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
    if (e.target.id == "gender") {
      setGender(e.target.value)
      if (e.target.value.length == 0) {
        setGenderError("Please select gender.")
      } else {
        setGenderError("")
      }
    }
    if (e.target.id == "status") {
      setStatus(e.target.value)
      if (e.target.value.length == 0) {
        setStatusError("Please select status.")
      } else {
        setStatusError("")
      }
    }
  }

  return (
    <div>
      {/* <p>Profile Page</p> */}
      <div className="profile">
        {/* Sidebar */}
        <Sidebar />

        <div className="profileSection">
          <div className="profileInnerSection">
            {/* Navbar */}
            <Navbar />

            {/* Navigation */}
            {/* <Navigation page="Profile" /> */}

            {/* Profile Detail Section */}

            <div className="profileBackgroundImage">
              {/* <p>Profile</p> */}
              {/* <img src="https://techzaa.getappui.com/velonic/layouts/assets/images/bg-profile.jpg" alt="profileBackgroundImage" /> */}
            </div>

            <div className="profileDetailSection">
              <div className="profileDetailInnerSection">
                <div className="profileDetailSecondInnerSection">
                  <div className="profileImageSection">
                    <div className="profileImageInnerSection">
                      <div className="profileImage">
                        <Image src={ProfilePicture} alt="ProfilePicture" />
                      </div>
                      <div className="profileNameSection">
                        <p className="userName">{name}</p>
                        <p className={role != "Employee" ? "userRole" : "employeeUserRole"}>
                          {role}
                        </p>
                        {role != "Employee" && (
                          <p className="userLocation">
                            {cityName}, {countryName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="profileEditBtnSection">
                      <button className="profileEditBtn" onClick={() => editLoginUser()}>
                        <Image className="editIcon" src={EditIcon} alt="EditIcon" />
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  <div className="profileUserInformationSection">
                    <div className="profileUserInformationInnerSection">
                      <div className="profileUserInformationHeading">
                        <p>Personal Information</p>
                      </div>
                      <div className="profileUserInformation">
                        <div className="profileUserInformationFirstSection">
                          <table>
                            <tbody>
                              <tr>
                                <th>Name</th>
                                <td>{name}</td>
                              </tr>
                              <tr>
                                <th>Email</th>
                                <td>{email}</td>
                              </tr>
                              <tr>
                                <th>Mobile Number</th>
                                <td>{mobileNumber}</td>
                              </tr>
                              <tr>
                                <th>Role</th>
                                <td>{role}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="profileUserInformationSecondSection">
                          <table>
                            <tbody>
                              {role == "Employee" && (
                                <>
                                  <tr>
                                    <th>Created By</th>
                                    <td>{superAdminId}</td>
                                  </tr>
                                  <tr>
                                    <th>Gender</th>
                                    <td>{gender}</td>
                                  </tr>
                                  <tr>
                                    <th>Status</th>
                                    <td>{status}</td>
                                  </tr>
                                </>
                              )}
                              {role != "Employee" && (
                                <>
                                  <tr>
                                    <th>Company Name</th>
                                    <td>{companyName}</td>
                                  </tr>
                                  <tr>
                                    <th>Location</th>
                                    <td>
                                      {address}, {cityName}, {stateName}, {countryName}
                                    </td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
      {/* Update Login User Modal */}
      {role != "Employee" && (
        <Modal show={editShawModal} onClose={() => closeBtn()}>
          <div className="updateTitle">
            <p>Update Profile</p>
          </div>
          <div className="updateFormSection">
            <div className="updateFormInnerSection">
              <form className="updateForm">
                <div className="updateFormInputSection">
                  <div className="updateFormInputFirstSection">
                    <label>Name</label>
                    <input
                      type="text"
                      className={nameError && "errorBorder"}
                      id="name"
                      value={name}
                      onChange={(e) => handler(e)}
                      placeholder="Enter a vendor name"
                    />
                    {nameError && <p className="errorMsg">{nameError}</p>}
                    <label>Password</label>
                    <input
                      type="password"
                      className={passwordError && "errorBorder"}
                      id="password"
                      value={password}
                      onChange={(e) => handler(e)}
                      placeholder="Enter a password"
                    />
                    {passwordError && <p className="errorMsg">{passwordError}</p>}
                    <label>Address</label>
                    <input
                      type="text"
                      className={addressError && "errorBorder"}
                      id="address"
                      value={address}
                      onChange={(e) => handler(e)}
                      placeholder="Enter a address"
                    />
                    {addressError && <p className="errorMsg">{addressError}</p>}
                    <label>State</label>
                    <Select
                      value="states"
                      id="state-name"
                      handler={handler}
                      stateNameError={stateNameError}
                      stateName={stateName}
                      setStateName={setStateName}
                    />
                    {stateNameError && <p className="errorMsg">{stateNameError}</p>}
                  </div>
                  <div className="updateFormInputSecondSection">
                    <label>Email</label>
                    <input
                      type="email"
                      className={emailError && "errorBorder"}
                      id="email"
                      value={email}
                      onChange={(e) => handler(e)}
                      placeholder="Enter a vendor email"
                    />
                    {emailError && <p className="errorMsg">{emailError}</p>}
                    <label>Company Name</label>
                    <input
                      type="text"
                      className={companyNameError && "errorBorder"}
                      id="company-name"
                      value={companyName}
                      onChange={(e) => handler(e)}
                      placeholder="Enter a company name"
                    />
                    {companyNameError && <p className="errorMsg">{companyNameError}</p>}
                    <label>Country</label>
                    <Select
                      value="countries"
                      id="country-name"
                      handler={handler}
                      countryNameError={countryNameError}
                      countryName={countryName}
                      setCountryName={setCountryName}
                    />
                    {countryNameError && <p className="errorMsg">{countryNameError}</p>}

                    <label>City</label>
                    <Select
                      value="cities"
                      id="city-name"
                      handler={handler}
                      cityNameError={cityNameError}
                      cityName={cityName}
                      setCityName={setCityName}
                    />
                    {cityNameError && <p className="errorMsg">{cityNameError}</p>}
                  </div>
                </div>
                <div className="updateFormInputThirdSection">
                  <label>Mobile Number</label>
                  <input
                    type="number"
                    className={mobileNumberError && "errorBorder"}
                    id="mobile-number"
                    value={mobileNumber}
                    onChange={(e) => handler(e)}
                    placeholder="Enter a mobile number"
                  />
                  {mobileNumberError && <p className="errorMsg">{mobileNumberError}</p>}
                </div>
                <div className="updateModalBtnSection">
                  <button
                    type="submit"
                    onClick={(e) => updateLoginUser(e)}
                    className="updateModalBtn"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {/* Update Employee Modal */}
      {role == "Employee" && (
        <Modal show={editShawModal} onClose={() => closeBtn()}>
          <div className="updateTitle">
            <p>Update Profile</p>
          </div>
          <div className="updateFormSection">
            <div className="updateFormInnerSection">
              <form className="updateForm">
                <div className="updateFormInputSection">
                  <div className="updateFormInputFirstSection">
                    <label>Name</label>
                    <input
                      type="text"
                      className={nameError && "errorBorder"}
                      id="name"
                      value={name}
                      onChange={(e) => handler(e)}
                      placeholder="Enter a employee name"
                    />
                    {nameError && <p className="errorMsg">{nameError}</p>}
                    <label>Password</label>
                    <input
                      type="password"
                      className={passwordError && "errorBorder"}
                      id="password"
                      value={password}
                      onChange={(e) => handler(e)}
                      placeholder="Enter a password"
                    />
                    {passwordError && <p className="errorMsg">{passwordError}</p>}
                    <label>Gender</label>
                    <select
                      className={genderError && "errorBorder"}
                      id="gender"
                      value={gender}
                      onChange={(e) => {
                        handler(e)
                      }}
                      placeholder="Select a Gender"
                    >
                      <option></option>
                      <option value={"Male"}>Male</option>
                      <option value={"Female"}>Female</option>
                      <option value={"Other"}>Other</option>
                    </select>
                    {genderError && <p className="errorMsg">{genderError}</p>}
                  </div>
                  <div className="updateFormInputSecondSection">
                    <label>Email</label>
                    <input
                      type="text"
                      className={emailError && "errorBorder"}
                      id="email"
                      value={email}
                      onChange={(e) => handler(e)}
                      placeholder="Enter a employee email"
                    />
                    {emailError && <p className="errorMsg">{emailError}</p>}
                    <label>Mobile Number</label>
                    <input
                      type="number"
                      className={mobileNumberError && "errorBorder"}
                      id="mobile-number"
                      value={mobileNumber}
                      onChange={(e) => handler(e)}
                      placeholder="Enter a mobile number"
                    />
                    {mobileNumberError && <p className="errorMsg">{mobileNumberError}</p>}
                    <label>Status</label>
                    <select
                      className={statusError && "errorBorder"}
                      id="status"
                      value={status}
                      onChange={(e) => {
                        handler(e)
                      }}
                      placeholder="Select a Status"
                    >
                      <option></option>
                      <option value={"Active"}>Active</option>
                      <option value={"Inactive"}>Inactive</option>
                    </select>
                    {statusError && <p className="errorMsg">{statusError}</p>}
                  </div>
                </div>
                <div className="updateModalBtnSection">
                  <button
                    type="submit"
                    onClick={(e) => updateLoginEmployee(e)}
                    className="updateModalBtn"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
