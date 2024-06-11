"use client"
import "../../styles/vendor.css"
import "../../styles/add-modal.css"
import "../../styles/edit-modal.css"
import "../../styles/table.css"
import Navbar from "@/components/Navebar"
import Sidebar from "@/components/Sidebar"
import Footer from "@/components/Footer"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DeleteVendor from "@/components/DeleteVendor"
import Modal from "@/components/Modal"
import Select from "@/components/Select"
import Navigation from "@/components/Navigation"
import Search from "@/components/Search"
import AddButton from "@/components/AddButton"
import ReactPaginate from "react-paginate"
import "../../styles/pagination.css"
import Image from "next/image"
import TableEditIcon from "../../../public/table-edit.svg"
import AccendingSelectArrowIcon from "../../../public/accending-select-arrow.svg"
import DecendingSelectArrowIcon from "../../../public/decending-select-arrow.svg"
import DisableSelectArrowIcon from "../../../public/disable-select-arrow.svg"

const { NEXT_PUBLIC_url } = process.env

export default function Page() {
  const router = useRouter()

  const regex = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$" //email validation regular expression

  // ====================================================
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rePassword, setRePassword] = useState("")
  const [role, setRole] = useState("Vendor")
  const [companyName, setCompanyName] = useState("")
  const [address, setAddress] = useState("")
  const [countryName, setCountryName] = useState("")
  const [stateName, setStateName] = useState("")
  const [cityName, setCityName] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  // ====================================================

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
  // ====================================================

  // ====================================================
  const [loginUserRole, setLoginUserRole] = useState(localStorage.getItem("role"))
  const [loginUserId, setloginUserId] = useState(localStorage.getItem("id"))
  // ====================================================

  const [vendors, setVendors] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editShawModal, setEditShowModal] = useState(false)

  const [search, setSearch] = useState("")

  // =================Accending or Decending Order====================
  const [nameAccendingOrderActive, setNameAccendingOrderActive] = useState(false)
  const [nameDecendingOrderActive, setNameDecendingOrderActive] = useState(false)
  const [emailAccendingOrderActive, setEmailAccendingOrderActive] = useState(false)
  const [emailDecendingOrderActive, setEmailDecendingOrderActive] = useState(false)
  const [mobileNumberAccendingOrderActive, setMobileNumberAccendingOrderActive] = useState(false)
  const [mobileNumberDecendingOrderActive, setMobileNumberDecendingOrderActive] = useState(false)
  const [companyNameAccendingOrderActive, setCompanyNameAccendingOrderActive] = useState(false)
  const [companyNameDecendingOrderActive, setCompanyNameDecendingOrderActive] = useState(false)
  const [countryNameAccendingOrderActive, setCountryNameAccendingOrderActive] = useState(false)
  const [countryNameDecendingOrderActive, setCountryNameDecendingOrderActive] = useState(false)
  const [stateNameAccendingOrderActive, setStateNameAccendingOrderActive] = useState(false)
  const [stateNameDecendingOrderActive, setStateNameDecendingOrderActive] = useState(false)
  const [cityNameAccendingOrderActive, setCityNameAccendingOrderActive] = useState(false)
  const [cityNameDecendingOrderActive, setCityNameDecendingOrderActive] = useState(false)
  // =================================================================

  useEffect(() => {
    ;(async () => {
      if (
        !localStorage.getItem("id") ||
        (loginUserRole != "Super Admin" &&
          loginUserRole != "Account Manager" &&
          loginUserRole != "Vendor")
      ) {
        router.push("/")
      } else {
        if (loginUserRole == "Super Admin" || loginUserRole == "Account Manager") {
          const vendor = await getVendors()
          // setVendors(vendor)
          setVendors([...vendor].sort((a, b) => (a.name < b.name ? -1 : 1)))
          setNameAccendingOrderActive(true)
          setNameDecendingOrderActive(false)
        } else if (loginUserRole == "Vendor") {
          const vendor = await getSingleVendors()
          // setVendors(vendor)
          setVendors([...vendor].sort((a, b) => (a.name < b.name ? -1 : 1)))
          setNameAccendingOrderActive(true)
          setNameDecendingOrderActive(false)
        }
      }
    })()
  }, [])

  const getVendors = async () => {
    let data = await fetch(`${NEXT_PUBLIC_url}/api/super-admin/vendor`, { cache: "no-cache" })
    data = await data.json()
    if (data.success) {
      return data.result
    } else {
      return { success: false }
    }
  }

  const getSingleVendors = async () => {
    let vendorId = loginUserId
    let data = await fetch(`${NEXT_PUBLIC_url}/api/super-admin/vendor/${vendorId}`, {
      cache: "no-cache",
    })
    data = await data.json()
    if (data.success) {
      return data.result
    } else {
      return { success: false }
    }
  }

  // ======================================================
  const addVendor = async (e) => {
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
        let result = await fetch(`${NEXT_PUBLIC_url}/api/super-admin/vendor`, {
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
            loginUserRole,
          }),
        })
        result = await result.json()
        if (result.invalidRole == false) {
          alert("User role is not valid")
        } else if (result.userAlreadyRegister == true) {
          alert("User is already register")
        } else if (result.userMobileNumberAlreadyRegister == true) {
          alert("User mobile number is already register")
        } else if (result.success) {
          alert("New Vendor Added")
          setName("")
          setEmail("")
          setPassword("")
          setRePassword("")
          setCompanyName("")
          setAddress("")
          setCountryName("")
          setStateName("")
          setCityName("")
          setMobileNumber("")
        } else {
          alert("Please Enter all field")
        }
      } else {
        alert("Please Enter Same Password")
      }
    }
  }
  // ======================================================

  // ======================================================
  const editVendor = async (
    _id,
    name,
    email,
    password,
    companyName,
    address,
    countryName,
    stateName,
    cityName,
    mobileNumber
  ) => {
    setEditShowModal(true)
    setId(_id)
    setName(name)
    setEmail(email)
    setPassword(password)
    setCompanyName(companyName)
    setAddress(address)
    setCountryName(countryName)
    setStateName(stateName)
    setCityName(cityName)
    setMobileNumber(mobileNumber)
  }

  const updateVendor = async (e) => {
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
      let vendorId = id
      let data = await fetch(`${NEXT_PUBLIC_url}/api/super-admin/vendor/${vendorId}`, {
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
          mobileNumber,
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
        alert("Vendor has been Updated")
        router.push("/vendor")
        setEditShowModal(false)
        setId("")
        setName("")
        setEmail("")
        setPassword("")
        setCompanyName("")
        setAddress("")
        setCountryName("")
        setStateName("")
        setCityName("")
        setMobileNumber("")
      } else {
        alert("Please Enter all field")
      }
    }
  }

  const closeBtn = () => {
    setShowModal(false)
    setEditShowModal(false)
    setId("")
    setName("")
    setEmail("")
    setPassword("")
    setRePassword("")
    setCompanyName("")
    setAddress("")
    setCountryName("")
    setStateName("")
    setCityName("")
    setMobileNumber("")

    setNameError("")
    setEmailError("")
    setPasswordError("")
    setRePasswordError("")
    setCompanyNameError("")
    setAddressError("")
    setCountryNameError("")
    setStateNameError("")
    setCityNameError("")
    setMobileNumberError("")
  }

  const searchFun = (e) => {
    e.preventDefault()
    localStorage.setItem("itemsPerPage", parseInt(e.target.value))
    setTimeout(() => {
      window.location.reload()
    }, 50)
  }

  useEffect(() => {
    if (localStorage.getItem("itemsPerPage")) {
      setItemsPerPage(parseInt(localStorage.getItem("itemsPerPage")))
    } else {
      localStorage.setItem("itemsPerPage", parseInt(5))
    }
  }, [])

  // =====================Name Accending or Decending Order====================
  const nameAccendingOrder = (e) => {
    e.preventDefault()
    setVendors([...vendors].sort((a, b) => (a.name < b.name ? -1 : 1)))
    setNameAccendingOrderActive(true)
    setNameDecendingOrderActive(false)

    setEmailAccendingOrderActive(false)
    setEmailDecendingOrderActive(false)
    setMobileNumberAccendingOrderActive(false)
    setMobileNumberDecendingOrderActive(false)
    setCompanyNameAccendingOrderActive(false)
    setCompanyNameDecendingOrderActive(false)
    setCountryNameAccendingOrderActive(false)
    setCountryNameDecendingOrderActive(false)
    setStateNameAccendingOrderActive(false)
    setStateNameDecendingOrderActive(false)
    setCityNameAccendingOrderActive(false)
    setCityNameDecendingOrderActive(false)
  }

  const nameDecendingOrder = (e) => {
    e.preventDefault()
    setVendors([...vendors].sort((a, b) => (a.name > b.name ? -1 : 1)))
    setNameDecendingOrderActive(true)
    setNameAccendingOrderActive(false)

    setEmailDecendingOrderActive(false)
    setEmailAccendingOrderActive(false)
    setMobileNumberDecendingOrderActive(false)
    setMobileNumberAccendingOrderActive(false)
    setCompanyNameDecendingOrderActive(false)
    setCompanyNameAccendingOrderActive(false)
    setCountryNameDecendingOrderActive(false)
    setCountryNameAccendingOrderActive(false)
    setStateNameDecendingOrderActive(false)
    setStateNameAccendingOrderActive(false)
    setCityNameDecendingOrderActive(false)
    setCityNameAccendingOrderActive(false)
  }
  // ========================================================================

  // =====================Email Accending or Decending Order====================
  const emailAccendingOrder = (e) => {
    e.preventDefault()
    setVendors([...vendors].sort((a, b) => (a.email < b.email ? -1 : 1)))
    setEmailAccendingOrderActive(true)
    setEmailDecendingOrderActive(false)

    setNameAccendingOrderActive(false)
    setNameDecendingOrderActive(false)
    setMobileNumberAccendingOrderActive(false)
    setMobileNumberDecendingOrderActive(false)
    setCompanyNameAccendingOrderActive(false)
    setCompanyNameDecendingOrderActive(false)
    setCountryNameAccendingOrderActive(false)
    setCountryNameDecendingOrderActive(false)
    setStateNameAccendingOrderActive(false)
    setStateNameDecendingOrderActive(false)
    setCityNameAccendingOrderActive(false)
    setCityNameDecendingOrderActive(false)
  }

  const emailDecendingOrder = (e) => {
    e.preventDefault()
    setVendors([...vendors].sort((a, b) => (a.email > b.email ? -1 : 1)))
    setEmailDecendingOrderActive(true)
    setEmailAccendingOrderActive(false)

    setNameDecendingOrderActive(false)
    setNameAccendingOrderActive(false)
    setMobileNumberDecendingOrderActive(false)
    setMobileNumberAccendingOrderActive(false)
    setCompanyNameDecendingOrderActive(false)
    setCompanyNameAccendingOrderActive(false)
    setCountryNameDecendingOrderActive(false)
    setCountryNameAccendingOrderActive(false)
    setStateNameDecendingOrderActive(false)
    setStateNameAccendingOrderActive(false)
    setCityNameDecendingOrderActive(false)
    setCityNameAccendingOrderActive(false)
  }
  // ========================================================================

  // =====================Mobile Number Accending or Decending Order====================
  const mobileNumberAccendingOrder = (e) => {
    e.preventDefault()
    setVendors([...vendors].sort((a, b) => (a.mobileNumber < b.mobileNumber ? -1 : 1)))
    setMobileNumberAccendingOrderActive(true)
    setMobileNumberDecendingOrderActive(false)

    setNameAccendingOrderActive(false)
    setNameDecendingOrderActive(false)
    setEmailAccendingOrderActive(false)
    setEmailDecendingOrderActive(false)
    setCompanyNameAccendingOrderActive(false)
    setCompanyNameDecendingOrderActive(false)
    setCountryNameAccendingOrderActive(false)
    setCountryNameDecendingOrderActive(false)
    setStateNameAccendingOrderActive(false)
    setStateNameDecendingOrderActive(false)
    setCityNameAccendingOrderActive(false)
    setCityNameDecendingOrderActive(false)
  }

  const mobileNumberDecendingOrder = (e) => {
    e.preventDefault()
    setVendors([...vendors].sort((a, b) => (a.mobileNumber > b.mobileNumber ? -1 : 1)))
    setMobileNumberDecendingOrderActive(true)
    setMobileNumberAccendingOrderActive(false)

    setNameDecendingOrderActive(false)
    setNameAccendingOrderActive(false)
    setEmailDecendingOrderActive(false)
    setEmailAccendingOrderActive(false)
    setCompanyNameDecendingOrderActive(false)
    setCompanyNameAccendingOrderActive(false)
    setCountryNameDecendingOrderActive(false)
    setCountryNameAccendingOrderActive(false)
    setStateNameDecendingOrderActive(false)
    setStateNameAccendingOrderActive(false)
    setCityNameDecendingOrderActive(false)
    setCityNameAccendingOrderActive(false)
  }
  // ========================================================================

  // =====================Company Name Accending or Decending Order====================
  const companyNameAccendingOrder = (e) => {
    e.preventDefault()
    setVendors([...vendors].sort((a, b) => (a.companyName < b.companyName ? -1 : 1)))
    setCompanyNameAccendingOrderActive(true)
    setCompanyNameDecendingOrderActive(false)

    setNameAccendingOrderActive(false)
    setNameDecendingOrderActive(false)
    setEmailAccendingOrderActive(false)
    setEmailDecendingOrderActive(false)
    setMobileNumberAccendingOrderActive(false)
    setMobileNumberDecendingOrderActive(false)
    setCountryNameAccendingOrderActive(false)
    setCountryNameDecendingOrderActive(false)
    setStateNameAccendingOrderActive(false)
    setStateNameDecendingOrderActive(false)
    setCityNameAccendingOrderActive(false)
    setCityNameDecendingOrderActive(false)
  }

  const companyNameDecendingOrder = (e) => {
    e.preventDefault()
    setVendors([...vendors].sort((a, b) => (a.companyName > b.companyName ? -1 : 1)))
    setCompanyNameDecendingOrderActive(true)
    setCompanyNameAccendingOrderActive(false)

    setNameDecendingOrderActive(false)
    setNameAccendingOrderActive(false)
    setEmailDecendingOrderActive(false)
    setEmailAccendingOrderActive(false)
    setMobileNumberDecendingOrderActive(false)
    setMobileNumberAccendingOrderActive(false)
    setCountryNameDecendingOrderActive(false)
    setCountryNameAccendingOrderActive(false)
    setStateNameDecendingOrderActive(false)
    setStateNameAccendingOrderActive(false)
    setCityNameDecendingOrderActive(false)
    setCityNameAccendingOrderActive(false)
  }
  // ========================================================================

  // =====================Country Name Accending or Decending Order====================
  const countryNameAccendingOrder = (e) => {
    e.preventDefault()
    setVendors([...vendors].sort((a, b) => (a.countryName < b.countryName ? -1 : 1)))
    setCountryNameAccendingOrderActive(true)
    setCountryNameDecendingOrderActive(false)

    setNameAccendingOrderActive(false)
    setNameDecendingOrderActive(false)
    setEmailAccendingOrderActive(false)
    setEmailDecendingOrderActive(false)
    setMobileNumberAccendingOrderActive(false)
    setMobileNumberDecendingOrderActive(false)
    setCompanyNameAccendingOrderActive(false)
    setCompanyNameDecendingOrderActive(false)
    setStateNameAccendingOrderActive(false)
    setStateNameDecendingOrderActive(false)
    setCityNameAccendingOrderActive(false)
    setCityNameDecendingOrderActive(false)
  }

  const countryNameDecendingOrder = (e) => {
    e.preventDefault()
    setVendors([...vendors].sort((a, b) => (a.countryName > b.countryName ? -1 : 1)))
    setCountryNameDecendingOrderActive(true)
    setCountryNameAccendingOrderActive(false)

    setNameDecendingOrderActive(false)
    setNameAccendingOrderActive(false)
    setEmailDecendingOrderActive(false)
    setEmailAccendingOrderActive(false)
    setMobileNumberDecendingOrderActive(false)
    setMobileNumberAccendingOrderActive(false)
    setCompanyNameDecendingOrderActive(false)
    setCompanyNameAccendingOrderActive(false)
    setStateNameDecendingOrderActive(false)
    setStateNameAccendingOrderActive(false)
    setCityNameDecendingOrderActive(false)
    setCityNameAccendingOrderActive(false)
  }
  // ========================================================================

  // =====================State Name Accending or Decending Order====================
  const stateNameAccendingOrder = (e) => {
    e.preventDefault()
    setVendors([...vendors].sort((a, b) => (a.stateName < b.stateName ? -1 : 1)))
    setStateNameAccendingOrderActive(true)
    setStateNameDecendingOrderActive(false)

    setNameAccendingOrderActive(false)
    setNameDecendingOrderActive(false)
    setEmailAccendingOrderActive(false)
    setEmailDecendingOrderActive(false)
    setMobileNumberAccendingOrderActive(false)
    setMobileNumberDecendingOrderActive(false)
    setCompanyNameAccendingOrderActive(false)
    setCompanyNameDecendingOrderActive(false)
    setCountryNameAccendingOrderActive(false)
    setCountryNameDecendingOrderActive(false)
    setCityNameAccendingOrderActive(false)
    setCityNameDecendingOrderActive(false)
  }

  const stateNameDecendingOrder = (e) => {
    e.preventDefault()
    setVendors([...vendors].sort((a, b) => (a.stateName > b.stateName ? -1 : 1)))
    setStateNameDecendingOrderActive(true)
    setStateNameAccendingOrderActive(false)

    setNameDecendingOrderActive(false)
    setNameAccendingOrderActive(false)
    setEmailDecendingOrderActive(false)
    setEmailAccendingOrderActive(false)
    setMobileNumberDecendingOrderActive(false)
    setMobileNumberAccendingOrderActive(false)
    setCompanyNameDecendingOrderActive(false)
    setCompanyNameAccendingOrderActive(false)
    setCountryNameDecendingOrderActive(false)
    setCountryNameAccendingOrderActive(false)
    setCityNameDecendingOrderActive(false)
    setCityNameAccendingOrderActive(false)
  }
  // ========================================================================

  // =====================City Name Accending or Decending Order====================
  const cityNameAccendingOrder = (e) => {
    e.preventDefault()
    setVendors([...vendors].sort((a, b) => (a.cityName < b.cityName ? -1 : 1)))
    setCityNameAccendingOrderActive(true)
    setCityNameDecendingOrderActive(false)

    setNameAccendingOrderActive(false)
    setNameDecendingOrderActive(false)
    setEmailAccendingOrderActive(false)
    setEmailDecendingOrderActive(false)
    setMobileNumberAccendingOrderActive(false)
    setMobileNumberDecendingOrderActive(false)
    setCompanyNameAccendingOrderActive(false)
    setCompanyNameDecendingOrderActive(false)
    setCountryNameAccendingOrderActive(false)
    setCountryNameDecendingOrderActive(false)
    setStateNameAccendingOrderActive(false)
    setStateNameDecendingOrderActive(false)
  }

  const cityNameDecendingOrder = (e) => {
    e.preventDefault()
    setVendors([...vendors].sort((a, b) => (a.cityName > b.cityName ? -1 : 1)))
    setCityNameDecendingOrderActive(true)
    setCityNameAccendingOrderActive(false)

    setNameDecendingOrderActive(false)
    setNameAccendingOrderActive(false)
    setEmailDecendingOrderActive(false)
    setEmailAccendingOrderActive(false)
    setMobileNumberDecendingOrderActive(false)
    setMobileNumberAccendingOrderActive(false)
    setCompanyNameDecendingOrderActive(false)
    setCompanyNameAccendingOrderActive(false)
    setCountryNameDecendingOrderActive(false)
    setCountryNameAccendingOrderActive(false)
    setStateNameDecendingOrderActive(false)
    setStateNameAccendingOrderActive(false)
  }
  // ========================================================================

  // ===================== Pagination =========================

  const items = vendors

  // const itemsPerPage = 5;

  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0)

  // Simulate fetching items from other resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage
  // console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  // const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage)

  // Invoke when the user clicks to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length
    setItemOffset(newOffset)
  }

  // ==============================================================

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
    <div>
      {/* <p>Vendor Page</p> */}
      <div className="vendor">
        {/* Sidebar */}
        <Sidebar />

        <div className="vendorSection">
          <div className="vendorInnerSection">
            {/* Navbar */}
            <Navbar />

            {/* Navigation */}
            {/* <Navigation page="Vendor" /> */}

            {/* Add Vendor Button */}
            {(loginUserRole == "Super Admin" || loginUserRole == "Account Manager") && (
              <AddButton page="Vendor" name="+ Add Vendor" setShowModal={setShowModal} />
            )}

            {/* Search Vendor */}
            <Search
              search={search}
              setSearch={setSearch}
              searchFun={searchFun}
              role={role}
              nameAccendingOrder={nameAccendingOrder}
              nameDecendingOrder={nameDecendingOrder}
              emailAccendingOrder={emailAccendingOrder}
              emailDecendingOrder={emailDecendingOrder}
              mobileNumberAccendingOrder={mobileNumberAccendingOrder}
              mobileNumberDecendingOrder={mobileNumberDecendingOrder}
              companyNameAccendingOrder={companyNameAccendingOrder}
              companyNameDecendingOrder={companyNameDecendingOrder}
              countryNameAccendingOrder={countryNameAccendingOrder}
              countryNameDecendingOrder={countryNameDecendingOrder}
              stateNameAccendingOrder={stateNameAccendingOrder}
              stateNameDecendingOrder={stateNameDecendingOrder}
              cityNameAccendingOrder={cityNameAccendingOrder}
              cityNameDecendingOrder={cityNameDecendingOrder}
            />

            {/* Vendor Table */}
            <div className="tableSection">
              <div className="tableInnerSection">
                <table>
                  <thead>
                    <tr>
                      <th className="tableSerialNumber">S.No</th>
                      {/* <th>Name</th> */}
                      {nameAccendingOrderActive == false && nameDecendingOrderActive == true ? (
                        <th onClick={(e) => nameAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Name</p>
                            <Image src={DecendingSelectArrowIcon} alt="DecendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : nameAccendingOrderActive == true && nameDecendingOrderActive == false ? (
                        <th onClick={(e) => nameDecendingOrder(e)}>
                          <div className="tableDecendingOrderBtn">
                            <p>Name</p>
                            <Image src={AccendingSelectArrowIcon} alt="AccendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : (
                        <th onClick={(e) => nameAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Name</p>
                            <Image src={DisableSelectArrowIcon} alt="DisableSelectArrowIcon" />
                          </div>
                        </th>
                      )}
                      {/* <th>Email</th> */}
                      {emailAccendingOrderActive == false && emailDecendingOrderActive == true ? (
                        <th onClick={(e) => emailAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Email</p>
                            <Image src={DecendingSelectArrowIcon} alt="DecendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : emailAccendingOrderActive == true &&
                        emailDecendingOrderActive == false ? (
                        <th onClick={(e) => emailDecendingOrder(e)}>
                          <div className="tableDecendingOrderBtn">
                            <p>Email</p>
                            <Image src={AccendingSelectArrowIcon} alt="AccendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : (
                        <th onClick={(e) => emailAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Email</p>
                            <Image src={DisableSelectArrowIcon} alt="DisableSelectArrowIcon" />
                          </div>
                        </th>
                      )}
                      {/* <th>Mobile Number</th> */}
                      {mobileNumberAccendingOrderActive == false &&
                      mobileNumberDecendingOrderActive == true ? (
                        <th onClick={(e) => mobileNumberAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Mobile Number</p>
                            <Image src={DecendingSelectArrowIcon} alt="DecendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : mobileNumberAccendingOrderActive == true &&
                        mobileNumberDecendingOrderActive == false ? (
                        <th onClick={(e) => mobileNumberDecendingOrder(e)}>
                          <div className="tableDecendingOrderBtn">
                            <p>Mobile Number</p>
                            <Image src={AccendingSelectArrowIcon} alt="AccendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : (
                        <th onClick={(e) => mobileNumberAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Mobile Number</p>
                            <Image src={DisableSelectArrowIcon} alt="DisableSelectArrowIcon" />
                          </div>
                        </th>
                      )}
                      {/* <th>Company Name</th> */}
                      {companyNameAccendingOrderActive == false &&
                      companyNameDecendingOrderActive == true ? (
                        <th onClick={(e) => companyNameAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Company Name</p>
                            <Image src={DecendingSelectArrowIcon} alt="DecendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : companyNameAccendingOrderActive == true &&
                        companyNameDecendingOrderActive == false ? (
                        <th onClick={(e) => companyNameDecendingOrder(e)}>
                          <div className="tableDecendingOrderBtn">
                            <p>Company Name</p>
                            <Image src={AccendingSelectArrowIcon} alt="AccendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : (
                        <th onClick={(e) => companyNameAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Company Name</p>
                            <Image src={DisableSelectArrowIcon} alt="DisableSelectArrowIcon" />
                          </div>
                        </th>
                      )}
                      {/* <th>Country</th> */}
                      {countryNameAccendingOrderActive == false &&
                      countryNameDecendingOrderActive == true ? (
                        <th onClick={(e) => countryNameAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Country</p>
                            <Image src={DecendingSelectArrowIcon} alt="DecendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : countryNameAccendingOrderActive == true &&
                        countryNameDecendingOrderActive == false ? (
                        <th onClick={(e) => countryNameDecendingOrder(e)}>
                          <div className="tableDecendingOrderBtn">
                            <p>Country</p>
                            <Image src={AccendingSelectArrowIcon} alt="AccendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : (
                        <th onClick={(e) => countryNameAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Country</p>
                            <Image src={DisableSelectArrowIcon} alt="DisableSelectArrowIcon" />
                          </div>
                        </th>
                      )}
                      {/* <th>State</th> */}
                      {stateNameAccendingOrderActive == false &&
                      stateNameDecendingOrderActive == true ? (
                        <th onClick={(e) => stateNameAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>State</p>
                            <Image src={DecendingSelectArrowIcon} alt="DecendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : stateNameAccendingOrderActive == true &&
                        stateNameDecendingOrderActive == false ? (
                        <th onClick={(e) => stateNameDecendingOrder(e)}>
                          <div className="tableDecendingOrderBtn">
                            <p>State</p>
                            <Image src={AccendingSelectArrowIcon} alt="AccendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : (
                        <th onClick={(e) => stateNameAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>State</p>
                            <Image src={DisableSelectArrowIcon} alt="DisableSelectArrowIcon" />
                          </div>
                        </th>
                      )}
                      {/* <th>City</th> */}
                      {cityNameAccendingOrderActive == false &&
                      cityNameDecendingOrderActive == true ? (
                        <th onClick={(e) => cityNameAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>City</p>
                            <Image src={DecendingSelectArrowIcon} alt="DecendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : cityNameAccendingOrderActive == true &&
                        cityNameDecendingOrderActive == false ? (
                        <th onClick={(e) => cityNameDecendingOrder(e)}>
                          <div className="tableDecendingOrderBtn">
                            <p>City</p>
                            <Image src={AccendingSelectArrowIcon} alt="AccendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : (
                        <th onClick={(e) => cityNameAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>City</p>
                            <Image src={DisableSelectArrowIcon} alt="DisableSelectArrowIcon" />
                          </div>
                        </th>
                      )}
                      {loginUserRole == "Super Admin" ||
                      loginUserRole == "Account Manager" ||
                      loginUserRole == "Vendor" ? (
                        <th>Action</th>
                      ) : (
                        ""
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {vendors != "" ? (
                      vendors
                        .filter((item) => {
                          if (search.toLowerCase() === "") {
                            return item
                          } else {
                            if (item.name.toLowerCase().match(search.toLowerCase())) {
                              return item.name.toLowerCase().includes(search.toLowerCase())
                            } else if (item.email.toLowerCase().match(search.toLowerCase())) {
                              return item.email.toLowerCase().includes(search.toLowerCase())
                            } else if (item.mobileNumber.toString().match(search.toString())) {
                              return item.mobileNumber.toString().includes(search.toString())
                            } else if (item.companyName.toLowerCase().match(search.toLowerCase())) {
                              return item.companyName.toLowerCase().includes(search.toLowerCase())
                            } else if (item.countryName.toLowerCase().match(search.toLowerCase())) {
                              return item.countryName.toLowerCase().includes(search.toLowerCase())
                            } else if (item.stateName.toLowerCase().match(search.toLowerCase())) {
                              return item.stateName.toLowerCase().includes(search.toLowerCase())
                            } else if (item.cityName.toLowerCase().match(search.toLowerCase())) {
                              return item.cityName.toLowerCase().includes(search.toLowerCase())
                            }
                          }
                        })
                        .slice(itemOffset, endOffset)
                        .map((item, index) => (
                          <tr key={index}>
                            <td>{endOffset - itemsPerPage + index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.mobileNumber}</td>
                            <td>{item.companyName}</td>
                            <td>{item.countryName}</td>
                            <td>{item.stateName}</td>
                            <td>{item.cityName}</td>
                            {(loginUserRole == "Super Admin" ||
                              loginUserRole == "Account Manager" ||
                              loginUserRole == "Vendor") &&
                            ((loginUserRole == "Vendor" && loginUserId == item._id) ||
                              loginUserRole == "Super Admin" ||
                              loginUserRole == "Account Manager") ? (
                              <>
                                <td className="tableAction">
                                  <button
                                    className="tableEditBtn"
                                    onClick={() =>
                                      editVendor(
                                        item._id,
                                        item.name,
                                        item.email,
                                        item.password,
                                        item.companyName,
                                        item.address,
                                        item.countryName,
                                        item.stateName,
                                        item.cityName,
                                        item.mobileNumber
                                      )
                                    }
                                  >
                                    {/* Edit */}
                                    <Image src={TableEditIcon} alt="TableEditIcon" />
                                  </button>
                                  <DeleteVendor id={item._id} />
                                </td>
                              </>
                            ) : (
                              ""
                            )}
                          </tr>
                        ))
                    ) : (
                      <tr className="no-data">
                        <td colSpan={9} align="center">
                          No Category
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="react-paginate">
              <div className="pagination-deteils">
                <p>
                  Showing {endOffset - itemsPerPage + 1} to{" "}
                  {items.length >= endOffset ? endOffset : items.length} of {items.length} entries
                </p>
              </div>
              <ReactPaginate
                breakLabel="..."
                nextLabel="Next"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="Previous"
                renderOnZeroPageCount={null}
              />
            </div>
          </div>
          <Footer />
        </div>
      </div>

      {/* Add Vendor Modal */}
      <Modal show={showModal} onClose={() => closeBtn()}>
        <div className="addTitle">
          <p>Add Vendor</p>
        </div>
        <div className="addFormSection">
          <div className="addFormInnerSection">
            <form className="addForm">
              <div className="addFormInputSection">
                <div className="addFormInputFirstSection">
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
                <div className="addFormInputSecondSection">
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
                  <label>Re-Password</label>
                  <input
                    type="password"
                    className={rePasswordError && "errorBorder"}
                    id="re-password"
                    value={rePassword}
                    onChange={(e) => handler(e)}
                    placeholder="Enter a password"
                  />
                  {rePasswordError && <p className="errorMsg">{rePasswordError}</p>}
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
              </div>
              <div className="addModalBtnSection">
                <button type="submit" onClick={(e) => addVendor(e)} className="addModalBtn">
                  + Add Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      {/* Update Vendor Modal */}
      <Modal show={editShawModal} onClose={() => closeBtn()}>
        <div className="updateTitle">
          <p>Update Vendor</p>
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
                <button type="submit" onClick={(e) => updateVendor(e)} className="updateModalBtn">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  )
}
