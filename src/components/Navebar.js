"use client"
import "../styles/navbar.css"
import Image from "next/image"
import Notification from "../../public/svg/notification"
import ProfileIcon from "../../public/profile.svg"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import ConfirmModal from "./ConfirmModal"
import ProfilePicture from "../../public/profile-picture.jpg"
import DeleteEmployee from "./DeleteEmployee"
import DeleteLoginUser from "./DeleteLoginUser"
import SearchIcon from "../../public/search.svg"
// import LogoutIcon from "../../public/logout.svg"
import NavbarLogoutIcon from "../../public/navbar-logout.svg"
import DeleteIcon from "../../public/delete.svg"
import NavbarProfileIcon from "../../public/navbar-profile.svg"
import NavbarDownArrowIcon from "../../public/navbar-down-arrow.svg"

const { NEXT_PUBLIC_url } = process.env

export default function Navbar() {
  const router = useRouter()

  const [confirmShowModal, setConfirmShowModal] = useState(false)

  const [deleteConfirmShowModal, setDeleteConfirmShowModal] = useState(false)

  const [deleteEmployeeConfirmShowModal, setDeleteEmployeeConfirmShowModal] = useState(false)

  const [name, setName] = useState(localStorage.getItem("name"))

  // ====================================================
  const [loginUserRole, setLoginUserRole] = useState(localStorage.getItem("role"))
  const [loginUserId, setloginUserId] = useState(localStorage.getItem("id"))
  // ====================================================

  const [show, setShow] = useState(false)

  const [clickAddBtn, setClickAddBtn] = useState(false)

  const deleteRecord = async () => {
    setConfirmShowModal(false)
    let response = await fetch(`${NEXT_PUBLIC_url}/api/super-admin/${loginUserId}`, {
      method: "delete",
      body: JSON.stringify({
        loginUserRole,
        loginUserId,
      }),
    })
    response = await response.json()
    console.log(response)
    if (response.invalidRole == false) {
      alert("User role is not valid")
    } else if (response.invalidUser == false) {
      alert("User is not valid")
    } else if (response.success) {
      alert("You are Successfully Delete your Account :)")
      localStorage.removeItem("id")
      localStorage.removeItem("name")
      localStorage.removeItem("email")
      localStorage.removeItem("password")
      localStorage.removeItem("role")
      localStorage.removeItem("companyName")
      localStorage.removeItem("address")
      localStorage.removeItem("countryName")
      localStorage.removeItem("stateName")
      localStorage.removeItem("cityName")
      localStorage.removeItem("mobileNumber")
      router.push("/")
    }
  }

  const deleteEmployeeRecord = async () => {
    setConfirmShowModal(false)
    let response = await fetch(`${NEXT_PUBLIC_url}/api/employee/${loginUserId}`, {
      method: "delete",
      body: JSON.stringify({
        loginUserRole,
        loginUserId,
      }),
    })
    response = await response.json()
    if (response.invalidRole == false) {
      alert("User role is not valid")
    } else if (response.invalidUser == false) {
      alert("User is not valid")
    } else if (response.success) {
      if (
        loginUserRole == "Super Admin" ||
        loginUserRole == "Account Manager" ||
        loginUserRole == "Vendor"
      ) {
        alert("Employee Deleted")
        router.push("/employee")
      } else if (loginUserRole == "Employee") {
        alert("You are Successfully Delete your Employee Account :)")
        localStorage.removeItem("id")
        localStorage.removeItem("name")
        localStorage.removeItem("email")
        localStorage.removeItem("password")
        localStorage.removeItem("role")
        localStorage.removeItem("companyName")
        localStorage.removeItem("address")
        localStorage.removeItem("countryName")
        localStorage.removeItem("stateName")
        localStorage.removeItem("cityName")
        localStorage.removeItem("mobileNumber")
        router.push("/")
      }
    }
  }

  window.onclick = function () {
    if (clickAddBtn) {
      setClickAddBtn(false)
    } else {
      if (show) {
        setShow(false)
      }
    }
  }

  /* When the user clicks on the button, 
    toggle between hiding and showing the dropdown content */
  const myNavFunction = () => {
    setClickAddBtn(true)
    if (show) {
      setShow(false)
    } else {
      setShow(true)
    }
  }

  // SignOut
  const signOut = () => {
    localStorage.removeItem("id")
    localStorage.removeItem("name")
    localStorage.removeItem("email")
    localStorage.removeItem("role")
    localStorage.removeItem("password")
    localStorage.removeItem("companyName")
    localStorage.removeItem("address")
    localStorage.removeItem("countryName")
    localStorage.removeItem("stateName")
    localStorage.removeItem("cityName")
    localStorage.removeItem("mobileNumber")
    localStorage.removeItem("superAdminId")
    localStorage.removeItem("gender")
    localStorage.removeItem("status")
    router.push("/")
    alert("You are Successfully Logout :)")
  }
  return (
    <>
      <div className="navbar">
        <div className="navbarInnerSection">
          <div className="search">
            <input type="text" placeholder="Search here..." />
            <Image src={SearchIcon} alt="Searchicon" />
          </div>
          <div className="profileAndNotificationIcon">
            <Notification />
            <div className="navdropdown">
              <button onClick={() => myNavFunction()} className="navdropbtn">
                <Image src={ProfilePicture} alt="ProfilePicture" />
                {name}
                <Image
                  className={show ? "navbarDropdownUpArrow navbar-down-arrow" : "navbar-down-arrow"}
                  src={NavbarDownArrowIcon}
                  alt="NavbarDownArrowIcon"
                />
              </button>
              {show && (
                <div id="myNavDropdown" className="nav-dropdown-content">
                  <p>Welcome!</p>
                  <Link href="/profile">
                    <Image src={NavbarProfileIcon} alt="NavbarProfileIcon" />
                    Profile
                  </Link>
                  {loginUserRole != "Employee" && (
                    <button onClick={() => setDeleteConfirmShowModal(true)}>
                      <Image src={DeleteIcon} alt="DeleteIcon" />
                      Delete Account
                    </button>
                  )}
                  {loginUserRole == "Employee" && (
                    <button onClick={() => setDeleteEmployeeConfirmShowModal(true)}>
                      <Image src={DeleteIcon} alt="DeleteIcon" />
                      Delete Account
                    </button>
                  )}
                  <button onClick={() => setConfirmShowModal(true)}>
                    <Image src={NavbarLogoutIcon} alt="NavbarLogoutIcon" />
                    Signout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal show={confirmShowModal} onClose={() => setConfirmShowModal(false)}>
        {/* Logout Modal */}
        <div>
          <p>Are you sure you want to logout?</p>
          <div className="confirmBtn">
            <button className="yesBtn" onClick={() => signOut()}>
              Yes
            </button>
            <button className="noBtn" onClick={() => setConfirmShowModal(false)}>
              No
            </button>
          </div>
        </div>
      </ConfirmModal>
      <ConfirmModal show={deleteConfirmShowModal} onClose={() => setDeleteConfirmShowModal(false)}>
        {/* Delete Modal */}
        <div>
          <p>Are you sure you want to delete account?</p>
          <div className="confirmBtn">
            <button className="yesBtn" onClick={() => deleteRecord()}>
              Yes
            </button>
            <button className="noBtn" onClick={() => setDeleteConfirmShowModal(false)}>
              No
            </button>
          </div>
        </div>
      </ConfirmModal>
      <ConfirmModal
        show={deleteEmployeeConfirmShowModal}
        onClose={() => setDeleteEmployeeConfirmShowModal(false)}
      >
        {/* Delete Modal */}
        <div>
          <p>Are you sure you want to delete employee?</p>
          <div className="confirmBtn">
            <button className="yesBtn" onClick={() => deleteEmployeeRecord()}>
              Yes
            </button>
            <button className="noBtn" onClick={() => setDeleteEmployeeConfirmShowModal(false)}>
              No
            </button>
          </div>
        </div>
      </ConfirmModal>
    </>
  )
}
