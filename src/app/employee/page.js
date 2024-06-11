"use client"
import "../../styles/employee.css"
import "../../styles/add-modal.css"
import "../../styles/edit-modal.css"
import "../../styles/table.css"
import Navbar from "@/components/Navebar"
import Sidebar from "@/components/Sidebar"
import Footer from "@/components/Footer"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DeleteEmployee from "@/components/DeleteEmployee"
import Modal from "@/components/Modal"
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
  const [superAdminId, setSuperAdminId] = useState(localStorage.getItem("email"))
  const [role, setRole] = useState("Employee")
  const [mobileNumber, setMobileNumber] = useState("")
  const [gender, setGender] = useState("")
  const [status, setStatus] = useState("")
  // ====================================================

  // ====================================================
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [rePasswordError, setRePasswordError] = useState("")
  const [mobileNumberError, setMobileNumberError] = useState("")
  const [genderError, setGenderError] = useState("")
  const [statusError, setStatusError] = useState("")
  // ====================================================

  // ====================================================
  const [loginUserRole, setLoginUserRole] = useState(localStorage.getItem("role"))
  const [loginUserId, setloginUserId] = useState(localStorage.getItem("id"))
  // ====================================================

  const [employees, setEmployees] = useState([])
  const [filterEmployees, setFilterEmployees] = useState([])
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
  const [superAdminIdAccendingOrderActive, setSuperAdminIdAccendingOrderActive] = useState(false)
  const [superAdminIdDecendingOrderActive, setSuperAdminIdDecendingOrderActive] = useState(false)
  // =================================================================

  // ========================Gender Filter==============================
  const [genderMaleFilterActive, setGenderMaleFilterActive] = useState(false)
  const [genderFemaleFilterActive, setGenderFemaleFilterActive] = useState(false)
  const [genderOtherFilterActive, setGenderOtherFilterActive] = useState(false)
  // ===================================================================

  // ========================Status Filter==============================
  const [activeStatusFilterActive, setActiveStatusFilterActive] = useState(false)
  const [inactiveStatusFilterActive, setInactiveStatusFilterActive] = useState(false)
  // ===================================================================

  useEffect(() => {
    ;(async () => {
      if (
        !localStorage.getItem("id") ||
        (loginUserRole != "Super Admin" &&
          loginUserRole != "Account Manager" &&
          loginUserRole != "Vendor" &&
          loginUserRole != "Employee")
      ) {
        router.push("/")
      } else {
        if (
          loginUserRole == "Super Admin" ||
          loginUserRole == "Account Manager" ||
          loginUserRole == "Vendor"
        ) {
          const employee = await getEmployees()
          // setEmployees(employee)
          setEmployees([...employee].sort((a, b) => (a.name < b.name ? -1 : 1)))
          setFilterEmployees([...employee].sort((a, b) => (a.name < b.name ? -1 : 1)))
          setNameAccendingOrderActive(true)
          setNameDecendingOrderActive(false)
        } else if (loginUserRole == "Employee") {
          const employee = await getSingleEmployee()
          // setEmployees(employee)
          setEmployees([...employee].sort((a, b) => (a.name < b.name ? -1 : 1)))
          setFilterEmployees([...employee].sort((a, b) => (a.name < b.name ? -1 : 1)))
          setNameAccendingOrderActive(true)
          setNameDecendingOrderActive(false)
        }
      }
    })()
  }, [])

  const getEmployees = async () => {
    let data = await fetch(`${NEXT_PUBLIC_url}/api/employee`, { cache: "no-cache" })
    data = await data.json()
    if (data.success) {
      return data.result
    } else {
      return { success: false }
    }
  }

  const getSingleEmployee = async () => {
    let employeeId = loginUserId
    let data = await fetch(`${NEXT_PUBLIC_url}/api/employee/${employeeId}`, {
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
  const addEmployee = async (e) => {
    e.preventDefault()
    if (
      !name ||
      !email ||
      !email.match(regex) ||
      !password ||
      password.length <= 6 ||
      !rePassword ||
      password != rePassword ||
      !gender ||
      !mobileNumber ||
      mobileNumber.toString().length != 10 ||
      !status
    ) {
      handle()
    } else {
      if (password == rePassword) {
        let result = await fetch(`${NEXT_PUBLIC_url}/api/employee`, {
          method: "POST",
          body: JSON.stringify({
            name,
            email,
            password,
            superAdminId,
            role,
            mobileNumber,
            gender,
            status,
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
          alert("New Employee Added")
          setName("")
          setEmail("")
          setPassword("")
          setRePassword("")
          setMobileNumber("")
          setGender("")
          setStatus("")
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
  const editEmployee = async (_id, name, email, password, mobileNumber, gender, status) => {
    setEditShowModal(true)
    setId(_id)
    setName(name)
    setEmail(email)
    setPassword(password)
    setMobileNumber(mobileNumber)
    setGender(gender)
    setStatus(status)
  }

  const updateEmployee = async (e) => {
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
        alert("Employee has been Updated")
        router.push("/employee")
        setEditShowModal(false)
        setId("")
        setName("")
        setEmail("")
        setPassword("")
        setMobileNumber("")
        setGender("")
        setStatus("")
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
    setMobileNumber("")
    setGender("")
    setStatus("")

    setNameError("")
    setEmailError("")
    setPasswordError("")
    setRePasswordError("")
    setMobileNumberError("")
    setGenderError("")
    setStatusError("")
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
    setEmployees([...employees].sort((a, b) => (a.name < b.name ? -1 : 1)))
    setNameAccendingOrderActive(true)
    setNameDecendingOrderActive(false)

    setEmailAccendingOrderActive(false)
    setEmailDecendingOrderActive(false)
    setMobileNumberAccendingOrderActive(false)
    setMobileNumberDecendingOrderActive(false)
    setSuperAdminIdAccendingOrderActive(false)
    setSuperAdminIdDecendingOrderActive(false)
  }

  const nameDecendingOrder = (e) => {
    e.preventDefault()
    setEmployees([...employees].sort((a, b) => (a.name > b.name ? -1 : 1)))
    setNameDecendingOrderActive(true)
    setNameAccendingOrderActive(false)

    setEmailDecendingOrderActive(false)
    setEmailAccendingOrderActive(false)
    setMobileNumberDecendingOrderActive(false)
    setMobileNumberAccendingOrderActive(false)
    setSuperAdminIdDecendingOrderActive(false)
    setSuperAdminIdAccendingOrderActive(false)
  }
  // ========================================================================

  // =====================Email Accending or Decending Order====================
  const emailAccendingOrder = (e) => {
    e.preventDefault()
    setEmployees([...employees].sort((a, b) => (a.email < b.email ? -1 : 1)))
    setEmailAccendingOrderActive(true)
    setEmailDecendingOrderActive(false)

    setNameAccendingOrderActive(false)
    setNameDecendingOrderActive(false)
    setMobileNumberAccendingOrderActive(false)
    setMobileNumberDecendingOrderActive(false)
    setSuperAdminIdAccendingOrderActive(false)
    setSuperAdminIdDecendingOrderActive(false)
  }

  const emailDecendingOrder = (e) => {
    e.preventDefault()
    setEmployees([...employees].sort((a, b) => (a.email > b.email ? -1 : 1)))
    setEmailDecendingOrderActive(true)
    setEmailAccendingOrderActive(false)

    setNameDecendingOrderActive(false)
    setNameAccendingOrderActive(false)
    setMobileNumberDecendingOrderActive(false)
    setMobileNumberAccendingOrderActive(false)
    setSuperAdminIdDecendingOrderActive(false)
    setSuperAdminIdAccendingOrderActive(false)
  }
  // ========================================================================

  // =====================Mobile Number Accending or Decending Order====================
  const mobileNumberAccendingOrder = (e) => {
    e.preventDefault()
    setEmployees([...employees].sort((a, b) => (a.mobileNumber < b.mobileNumber ? -1 : 1)))
    setMobileNumberAccendingOrderActive(true)
    setMobileNumberDecendingOrderActive(false)

    setNameAccendingOrderActive(false)
    setNameDecendingOrderActive(false)
    setEmailAccendingOrderActive(false)
    setEmailDecendingOrderActive(false)
    setSuperAdminIdAccendingOrderActive(false)
    setSuperAdminIdDecendingOrderActive(false)
  }

  const mobileNumberDecendingOrder = (e) => {
    e.preventDefault()
    setEmployees([...employees].sort((a, b) => (a.mobileNumber > b.mobileNumber ? -1 : 1)))
    setMobileNumberDecendingOrderActive(true)
    setMobileNumberAccendingOrderActive(false)

    setNameDecendingOrderActive(false)
    setNameAccendingOrderActive(false)
    setEmailDecendingOrderActive(false)
    setEmailAccendingOrderActive(false)
    setSuperAdminIdDecendingOrderActive(false)
    setSuperAdminIdAccendingOrderActive(false)
  }
  // ========================================================================

  // =====================(superAdminId) Created By Accending or Decending Order====================
  const superAdminIdAccendingOrder = (e) => {
    e.preventDefault()
    setEmployees([...employees].sort((a, b) => (a.superAdminId < b.superAdminId ? -1 : 1)))
    setSuperAdminIdAccendingOrderActive(true)
    setSuperAdminIdDecendingOrderActive(false)

    setNameAccendingOrderActive(false)
    setNameDecendingOrderActive(false)
    setEmailAccendingOrderActive(false)
    setEmailDecendingOrderActive(false)
    setMobileNumberAccendingOrderActive(false)
    setMobileNumberDecendingOrderActive(false)
  }

  const superAdminIdDecendingOrder = (e) => {
    e.preventDefault()
    setEmployees([...employees].sort((a, b) => (a.superAdminId > b.superAdminId ? -1 : 1)))
    setSuperAdminIdDecendingOrderActive(true)
    setSuperAdminIdAccendingOrderActive(false)

    setNameDecendingOrderActive(false)
    setNameAccendingOrderActive(false)
    setEmailDecendingOrderActive(false)
    setEmailAccendingOrderActive(false)
    setMobileNumberDecendingOrderActive(false)
    setMobileNumberAccendingOrderActive(false)
  }
  // ========================================================================

  // =====================Gender Filter====================
  //==================Male============================
  const genderMaleFilter = (e) => {
    e.preventDefault()
    if (genderMaleFilterActive == false) {
      if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male"))
        setGenderMaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male" || a.gender == "Female"))
        setGenderMaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male" || a.gender == "Other"))
        setGenderMaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male" || a.status == "Active"))
        setGenderMaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Male" || a.status == "Inactive")
        )
        setGenderMaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Female" || a.gender == "Other"
          )
        )
        setGenderMaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Female" || a.status == "Active"
          )
        )
        setGenderMaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Female" || a.status == "Inactive"
          )
        )
        setGenderMaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Other" || a.status == "Active"
          )
        )
        setGenderMaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Other" || a.status == "Inactive"
          )
        )
        setGenderMaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.status == "Active" || a.status == "Inactive"
          )
        )
        setGenderMaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Female" ||
              a.gender == "Other" ||
              a.status == "Active"
          )
        )
        setGenderMaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Female" ||
              a.status == "Active" ||
              a.status == "Inactive"
          )
        )
        setGenderMaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Other" ||
              a.status == "Active" ||
              a.status == "Inactive"
          )
        )
        setGenderMaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Female" ||
              a.gender == "Other" ||
              a.status == "Active" ||
              a.status == "Inactive"
          )
        )
        setGenderMaleFilterActive(true)
      }
    } else {
      if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees])
        setGenderMaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Female"))
        setGenderMaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Other"))
        setGenderMaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.status == "Active"))
        setGenderMaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees([...filterEmployees].filter((a) => a.status == "Inactive"))
        setGenderMaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Female" || a.gender == "Other")
        )
        setGenderMaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Female" || a.status == "Active")
        )
        setGenderMaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Female" || a.status == "Inactive")
        )
        setGenderMaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Other" || a.status == "Active")
        )
        setGenderMaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Other" || a.status == "Inactive")
        )
        setGenderMaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.status == "Active" || a.status == "Inactive")
        )
        setGenderMaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Female" || a.gender == "Other" || a.status == "Active"
          )
        )
        setGenderMaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Female" || a.status == "Active" || a.status == "Inactive"
          )
        )
        setGenderMaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Other" || a.status == "Active" || a.status == "Inactive"
          )
        )
        setGenderMaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Female" ||
              a.gender == "Other" ||
              a.status == "Active" ||
              a.status == "Inactive"
          )
        )
        setGenderMaleFilterActive(false)
      }
    }
  }
  // ================================================

  // ==================Female========================
  const genderFemaleFilter = (e) => {
    e.preventDefault()

    if (genderFemaleFilterActive == false) {
      if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Female"))
        setGenderFemaleFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male" || a.gender == "Female"))
        setGenderFemaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Female" || a.gender == "Other")
        )
        setGenderFemaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Female" || a.status == "Active")
        )
        setGenderFemaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Female" || a.status == "Inactive")
        )
        setGenderFemaleFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Female" || a.gender == "Other"
          )
        )
        setGenderFemaleFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Female" || a.status == "Active"
          )
        )
        setGenderFemaleFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Female" || a.status == "Inactive"
          )
        )
        setGenderFemaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Female" || a.gender == "Other" || a.status == "Active"
          )
        )
        setGenderFemaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Female" || a.gender == "Other" || a.status == "Inactive"
          )
        )
        setGenderFemaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Female" || a.status == "Active" || a.status == "Inactive"
          )
        )
        setGenderFemaleFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Female" ||
              a.gender == "Other" ||
              a.status == "Active"
          )
        )
        setGenderFemaleFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Female" ||
              a.status == "Active" ||
              a.status == "Inactive"
          )
        )
        setGenderFemaleFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Female" ||
              a.gender == "Other" ||
              a.status == "Active" ||
              a.status == "Inactive"
          )
        )
        setGenderFemaleFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Female" ||
              a.gender == "Other" ||
              a.status == "Active" ||
              a.status == "Inactive"
          )
        )
        setGenderFemaleFilterActive(true)
      }
    } else {
      if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees])
        setGenderFemaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male"))
        setGenderFemaleFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Other"))
        setGenderFemaleFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.status == "Active"))
        setGenderFemaleFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees([...filterEmployees].filter((a) => a.status == "Inactive"))
        setGenderFemaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male" || a.gender == "Other"))
        setGenderFemaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male" || a.status == "Active"))
        setGenderFemaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Male" || a.status == "Inactive")
        )
        setGenderFemaleFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Other" || a.status == "Active")
        )
        setGenderFemaleFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Other" || a.status == "Inactive")
        )
        setGenderFemaleFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.status == "Active" || a.status == "Inactive")
        )
        setGenderFemaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Other" || a.status == "Active"
          )
        )
        setGenderFemaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.status == "Active" || a.status == "Inactive"
          )
        )
        setGenderFemaleFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Other" || a.status == "Active" || a.status == "Inactive"
          )
        )
        setGenderFemaleFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Other" ||
              a.status == "Active" ||
              a.status == "Inactive"
          )
        )
        setGenderFemaleFilterActive(false)
      }
    }
  }
  // ===============================================

  // ================Other==========================
  const genderOtherFilter = (e) => {
    e.preventDefault()

    if (genderOtherFilterActive == false) {
      if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Other"))
        setGenderOtherFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male" || a.gender == "Other"))
        setGenderOtherFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Female" || a.gender == "Other")
        )
        setGenderOtherFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Other" || a.status == "Active")
        )
        setGenderOtherFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Other" || a.status == "Inactive")
        )
        setGenderOtherFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Female" || a.gender == "Other"
          )
        )
        setGenderOtherFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Other" || a.status == "Active"
          )
        )
        setGenderOtherFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Other" || a.status == "Inactive"
          )
        )
        setGenderOtherFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Female" || a.gender == "Other" || a.status == "Active"
          )
        )
        setGenderOtherFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Female" || a.gender == "Other" || a.status == "Inactive"
          )
        )
        setGenderOtherFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Other" || a.status == "Active" || a.status == "Inactive"
          )
        )
        setGenderOtherFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Female" ||
              a.gender == "Other" ||
              a.status == "Active"
          )
        )
        setGenderOtherFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Other" ||
              a.status == "Active" ||
              a.status == "Inactive"
          )
        )
        setGenderOtherFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Female" ||
              a.gender == "Other" ||
              a.status == "Active" ||
              a.status == "Inactive"
          )
        )
        setGenderOtherFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Female" ||
              a.gender == "Other" ||
              a.status == "Active" ||
              a.status == "Inactive"
          )
        )
        setGenderOtherFilterActive(true)
      }
    } else {
      if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees])
        setGenderOtherFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male"))
        setGenderOtherFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Female"))
        setGenderOtherFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.status == "Active"))
        setGenderOtherFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees([...filterEmployees].filter((a) => a.status == "Inactive"))
        setGenderOtherFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male" || a.gender == "Female"))
        setGenderOtherFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male" || a.status == "Active"))
        setGenderOtherFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Male" || a.status == "Inactive")
        )
        setGenderOtherFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Female" || a.status == "Active")
        )
        setGenderOtherFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Female" || a.status == "Inactive")
        )
        setGenderOtherFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.status == "Active" || a.status == "Inactive")
        )
        setGenderOtherFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Female" || a.status == "Active"
          )
        )
        setGenderOtherFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.status == "Active" || a.status == "Inactive"
          )
        )
        setGenderOtherFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Female" || a.status == "Active" || a.status == "Inactive"
          )
        )
        setGenderOtherFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Female" ||
              a.status == "Active" ||
              a.status == "Inactive"
          )
        )
        setGenderOtherFilterActive(false)
      }
    }
  }
  //===============================================
  // ========================================================================

  // =====================Status Filter====================
  //==================Active Status============================
  const activeStatusFilter = (e) => {
    e.preventDefault()
    if (activeStatusFilterActive == false) {
      if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.status == "Active"))
        setActiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male" || a.status == "Active"))
        setActiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Female" || a.status == "Active")
        )
        setActiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Other" || a.status == "Active")
        )
        setActiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.status == "Active" || a.status == "Inactive")
        )
        setActiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Female" || a.status == "Active"
          )
        )
        setActiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Other" || a.status == "Active"
          )
        )
        setActiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.status == "Active" || a.status == "Inactive"
          )
        )
        setActiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Female" || a.gender == "Other" || a.status == "Active"
          )
        )
        setActiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Female" || a.status == "Active" || a.status == "Inactive"
          )
        )
        setActiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Other" || a.status == "Active" || a.status == "Inactive"
          )
        )
        setActiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Female" ||
              a.gender == "Other" ||
              a.status == "Active"
          )
        )
        setActiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Other" ||
              a.status == "Active" ||
              a.status == "Inactive"
          )
        )
        setActiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Female" ||
              a.gender == "Other" ||
              a.status == "Active" ||
              a.status == "Inactive"
          )
        )
        setActiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Female" ||
              a.gender == "Other" ||
              a.status == "Active" ||
              a.status == "Inactive"
          )
        )
        setActiveStatusFilterActive(true)
      }
    } else {
      if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees])
        setActiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male"))
        setActiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Female"))
        setActiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Other"))
        setActiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees([...filterEmployees].filter((a) => a.status == "Inactive"))
        setActiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male" || a.gender == "Female"))
        setActiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male" || a.gender == "Other"))
        setActiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Male" || a.status == "Inactive")
        )
        setActiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Female" || a.gender == "Other")
        )
        setActiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Female" || a.status == "Inactive")
        )
        setActiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Other" || a.status == "Inactive")
        )
        setActiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Female" || a.gender == "Other"
          )
        )
        setActiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Other" || a.status == "Inactive"
          )
        )
        setActiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Female" || a.gender == "Other" || a.status == "Inactive"
          )
        )
        setActiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Female" ||
              a.gender == "Other" ||
              a.status == "Inactive"
          )
        )
        setActiveStatusFilterActive(false)
      }
    }
  }
  // ================================================

  // ==================Inactive Status========================
  const inactiveStatusFilter = (e) => {
    e.preventDefault()
    if (inactiveStatusFilterActive == false) {
      if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees([...filterEmployees].filter((a) => a.status == "Inactive"))
        setInactiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Male" || a.status == "Inactive")
        )
        setInactiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Female" || a.status == "Inactive")
        )
        setInactiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Other" || a.status == "Inactive")
        )
        setInactiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.status == "Active" || a.status == "Inactive")
        )
        setInactiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Female" || a.status == "Inactive"
          )
        )
        setInactiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Other" || a.status == "Inactive"
          )
        )
        setInactiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.status == "Active" || a.status == "Inactive"
          )
        )
        setInactiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Female" || a.gender == "Other" || a.status == "Inactive"
          )
        )
        setInactiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Female" || a.status == "Active" || a.status == "Inactive"
          )
        )
        setInactiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Other" || a.status == "Active" || a.status == "Inactive"
          )
        )
        setInactiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Female" ||
              a.gender == "Other" ||
              a.status == "Inactive"
          )
        )
        setInactiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Other" ||
              a.status == "Active" ||
              a.status == "Inactive"
          )
        )
        setInactiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Female" ||
              a.gender == "Other" ||
              a.status == "Active" ||
              a.status == "Inactive"
          )
        )
        setInactiveStatusFilterActive(true)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == false
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Female" ||
              a.gender == "Other" ||
              a.status == "Active" ||
              a.status == "Inactive"
          )
        )
        setInactiveStatusFilterActive(true)
      }
    } else {
      if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees([...filterEmployees])
        setInactiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male"))
        setInactiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Female"))
        setInactiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Other"))
        setInactiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees([...filterEmployees].filter((a) => a.status == "Active"))
        setInactiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male" || a.gender == "Female"))
        setInactiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male" || a.gender == "Other"))
        setInactiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees([...filterEmployees].filter((a) => a.gender == "Male" || a.status == "Active"))
        setInactiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Female" || a.gender == "Other")
        )
        setInactiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == false &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Female" || a.status == "Active")
        )
        setInactiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter((a) => a.gender == "Other" || a.status == "Active")
        )
        setInactiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == false &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Female" || a.gender == "Other"
          )
        )
        setInactiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == false &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Male" || a.gender == "Other" || a.status == "Active"
          )
        )
        setInactiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == false &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) => a.gender == "Female" || a.gender == "Other" || a.status == "Active"
          )
        )
        setInactiveStatusFilterActive(false)
      } else if (
        genderMaleFilterActive == true &&
        genderFemaleFilterActive == true &&
        genderOtherFilterActive == true &&
        activeStatusFilterActive == true &&
        inactiveStatusFilterActive == true
      ) {
        setEmployees(
          [...filterEmployees].filter(
            (a) =>
              a.gender == "Male" ||
              a.gender == "Female" ||
              a.gender == "Other" ||
              a.status == "Active"
          )
        )
        setInactiveStatusFilterActive(false)
      }
    }
  }
  // ===============================================
  // ========================================================================

  // ===================== Pagination =========================

  const items = employees

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
    if (!gender) {
      setGenderError("Please select gender.")
    } else {
      setGenderError("")
    }
    if (!mobileNumber) {
      setMobileNumberError("Please enter mobile number.")
    } else if (mobileNumber.toString().length != 10) {
      setMobileNumberError("Please enter valid mobile number.")
    } else {
      setMobileNumberError("")
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
    if (e.target.id == "gender") {
      setGender(e.target.value)
      if (e.target.value.length == 0) {
        setGenderError("Please select gender.")
      } else {
        setGenderError("")
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
      {/* <p>Employee Page</p> */}
      <div className="employee">
        {/* Sidebar */}
        <Sidebar />

        <div className="employeeSection">
          <div className="employeeInnerSection">
            {/* Navbar */}
            <Navbar />

            {/* Navigation */}
            {/* <Navigation page="Employee" /> */}

            {/* Add Employee Button */}
            {(loginUserRole == "Super Admin" ||
              loginUserRole == "Account Manager" ||
              loginUserRole == "Vendor") && (
              <AddButton page="Employee" name="+ Add Employee" setShowModal={setShowModal} />
            )}

            {/* Search Employee */}
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
              superAdminIdAccendingOrder={superAdminIdAccendingOrder}
              superAdminIdDecendingOrder={superAdminIdDecendingOrder}
              genderMaleFilterActive={genderMaleFilterActive}
              genderMaleFilter={genderMaleFilter}
              genderFemaleFilterActive={genderFemaleFilterActive}
              genderFemaleFilter={genderFemaleFilter}
              genderOtherFilterActive={genderOtherFilterActive}
              genderOtherFilter={genderOtherFilter}
              activeStatusFilterActive={activeStatusFilterActive}
              activeStatusFilter={activeStatusFilter}
              inactiveStatusFilterActive={inactiveStatusFilterActive}
              inactiveStatusFilter={inactiveStatusFilter}
            />

            {/* Employee Table */}
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
                      <th>Gender</th>
                      <th>Status</th>
                      {/* <th>Created By</th> */}
                      {superAdminIdAccendingOrderActive == false &&
                      superAdminIdDecendingOrderActive == true ? (
                        <th onClick={(e) => superAdminIdAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Created By</p>
                            <Image src={DecendingSelectArrowIcon} alt="DecendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : superAdminIdAccendingOrderActive == true &&
                        superAdminIdDecendingOrderActive == false ? (
                        <th onClick={(e) => superAdminIdDecendingOrder(e)}>
                          <div className="tableDecendingOrderBtn">
                            <p>Created By</p>
                            <Image src={AccendingSelectArrowIcon} alt="AccendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : (
                        <th onClick={(e) => superAdminIdAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Created By</p>
                            <Image src={DisableSelectArrowIcon} alt="DisableSelectArrowIcon" />
                          </div>
                        </th>
                      )}
                      {loginUserRole == "Super Admin" ||
                      loginUserRole == "Account Manager" ||
                      loginUserRole == "Vendor" ||
                      loginUserRole == "Employee" ? (
                        <th>Action</th>
                      ) : (
                        ""
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {employees != "" ? (
                      employees
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
                            } else if (item.gender.toLowerCase().match(search.toLowerCase())) {
                              return item.gender.toLowerCase().includes(search.toLowerCase())
                            } else if (item.status.toLowerCase().match(search.toLowerCase())) {
                              return item.status.toLowerCase().includes(search.toLowerCase())
                            } else if (
                              item.superAdminId.toLowerCase().match(search.toLowerCase())
                            ) {
                              return item.superAdminId.toLowerCase().includes(search.toLowerCase())
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
                            <td>{item.gender}</td>
                            <td>{item.status}</td>
                            <td>{item.superAdminId}</td>
                            {(loginUserRole == "Super Admin" ||
                              loginUserRole == "Account Manager" ||
                              loginUserRole == "Vendor" ||
                              loginUserRole == "Employee") &&
                            ((loginUserRole == "Employee" && loginUserId == item._id) ||
                              loginUserRole == "Super Admin" ||
                              loginUserRole == "Account Manager" ||
                              loginUserRole == "Vendor") ? (
                              <>
                                <td className="tableAction">
                                  <button
                                    className="tableEditBtn"
                                    onClick={() =>
                                      editEmployee(
                                        item._id,
                                        item.name,
                                        item.email,
                                        item.password,
                                        item.mobileNumber,
                                        item.gender,
                                        item.status
                                      )
                                    }
                                  >
                                    {/* Edit */}
                                    <Image src={TableEditIcon} alt="TableEditIcon" />
                                  </button>
                                  <DeleteEmployee id={item._id} />
                                </td>
                              </>
                            ) : (
                              ""
                            )}
                          </tr>
                        ))
                    ) : (
                      <tr className="no-data">
                        <td colSpan={8} align="center">
                          No Employee
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

      {/* Add Employee Modal */}
      <Modal show={showModal} onClose={() => closeBtn()}>
        <div className="addTitle">
          <p>Add Employee</p>
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
                <div className="addFormInputSecondSection">
                  <label>Email</label>
                  <input
                    type="email"
                    className={emailError && "errorBorder"}
                    id="email"
                    value={email}
                    onChange={(e) => handler(e)}
                    placeholder="Enter a employee email"
                  />
                  {emailError && <p className="errorMsg">{emailError}</p>}
                  <label>Re-Password</label>
                  <input
                    type="password"
                    className={rePasswordError && "errorBorder"}
                    id="re-password"
                    value={rePassword}
                    onChange={(e) => handler(e)}
                    placeholder="Enter a repassword"
                  />
                  {rePasswordError && <p className="errorMsg">{rePasswordError}</p>}
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
              <div className="addFormInputThirdSection">
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
              <div className="addModalBtnSection">
                <button type="submit" onClick={(e) => addEmployee(e)} className="addModalBtn">
                  + Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      {/* Update Employee Modal */}
      <Modal show={editShawModal} onClose={() => closeBtn()}>
        <div className="updateTitle">
          <p>Update Employee</p>
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
                <button type="submit" onClick={(e) => updateEmployee(e)} className="updateModalBtn">
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
