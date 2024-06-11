"use client"
import "../styles/sidebar.css"
import Image from "next/image"
import AdminLogo from "./../../public/AdminLogo.webp"
import LogoutIcon from "../../public/logout.svg"
import PaymentPlanIcon from "../../public/payment-plan.svg"
import ReportIcon from "../../public/book.svg"
import BillingIcon from "../../public/bill.svg"
import SpeedIcon from "../../public/speed.svg"
import UserIcon from "../../public/user.svg"
import AccountManagerIcon from "../../public/account-manager.svg"
import DashboardIcon from "../../public/dashboard.svg"
import DownArrowIcon from "../../public/down-arrow.svg"
import StarIcon from "../../public/star.svg"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import ConfirmModal from "./ConfirmModal"
import { useEffect, useState } from "react"
import ProfilePicture from "../../public/profile-picture.jpg"
import ProfileNameDownArrowIcon from "../../public/profilename-down-arrow.svg"
import DeleteEmployee from "./DeleteEmployee"
import DeleteLoginUser from "./DeleteLoginUser"

const { NEXT_PUBLIC_url } = process.env

export default function Sidebar() {
  const router = useRouter()

  const pathname = usePathname()

  console.log("router path", pathname)

  const [confirmShowModal, setConfirmShowModal] = useState(false)

  const [deleteConfirmShowModal, setDeleteConfirmShowModal] = useState(false)

  const [deleteEmployeeConfirmShowModal, setDeleteEmployeeConfirmShowModal] = useState(false)

  const [show, setShow] = useState(false)

  const [profileShow, setProfileShow] = useState(false)

  const [name, setName] = useState(localStorage.getItem("name"))

  const [clickProfileName, setClickProfileName] = useState(false)

  // ====================================================
  const [loginUserRole, setLoginUserRole] = useState(localStorage.getItem("role"))
  const [loginUserId, setloginUserId] = useState(localStorage.getItem("id"))
  // ====================================================

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
    if (clickProfileName) {
      setClickProfileName(false)
    } else {
      if (profileShow) {
        setProfileShow(false)
      }
    }
  }

  /* When the user clicks on the button, 
    toggle between hiding and showing the dropdown content */
  const myNameFunction = () => {
    setClickProfileName(true)
    if (profileShow) {
      setProfileShow(false)
    } else {
      setProfileShow(true)
    }
  }

  /* When the user clicks on the button, 
    toggle between hiding and showing the dropdown content */
  const myFunction = () => {
    if (show) {
      setShow(false)
    } else {
      setShow(true)
    }
  }

  useEffect(() => {
    if (pathname == "/add-product" || pathname == "/product" || pathname == "/category") {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [])

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
      <div className="sidebar">
        <div className="sidebarInnerSection">
          <div>
            <div className="titleSection">
              <div className="titleInnerSection">
                <Link href="" className="title">
                  Elicit
                </Link>
              </div>
            </div>
            <div id="menu" className="menu">
              <div className="menuInnerSection">
                <div className={pathname == "/dashboard" ? "active menuDiv" : "menuDiv"}>
                  <Link className="linkText" href="/dashboard">
                    <Image src={DashboardIcon} alt="DashboardIcon" />
                    Dashboard
                  </Link>
                </div>
                {loginUserRole == "Super Admin" || loginUserRole == "Account Manager" ? (
                  <div className={pathname == "/account-manager" ? "active menuDiv" : "menuDiv"}>
                    <Link className="linkText" href="/account-manager">
                      <Image src={AccountManagerIcon} alt="AccountManagerIcon" />
                      Account Manager
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {loginUserRole == "Super Admin" ||
                loginUserRole == "Account Manager" ||
                loginUserRole == "Vendor" ? (
                  <div className={pathname == "/vendor" ? "active menuDiv" : "menuDiv"}>
                    <Link className="linkText" href="/vendor">
                      <Image src={UserIcon} alt="VendorIcon" />
                      Vendor
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {loginUserRole == "Super Admin" ||
                loginUserRole == "Account Manager" ||
                loginUserRole == "Vendor" ||
                loginUserRole == "Employee" ? (
                  <div className={pathname == "/employee" ? "active menuDiv" : "menuDiv"}>
                    <Link className="linkText" href="/employee">
                      <Image src={UserIcon} alt="EmployeeIcon" />
                      Employee
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                <div className="dropdown">
                  <div className="menuDiv">
                    <Link className="linkText productDropdown" href="" onClick={() => myFunction()}>
                      <span className="productDropdownName">
                        <Image src={SpeedIcon} alt="ProductIcon" />
                        Product
                      </span>
                      <span className="productDropdownArrow">
                        <Image
                          className={show ? "productDropdownUpArrow" : ""}
                          src={DownArrowIcon}
                          alt="DownArrowIcon"
                        />
                      </span>
                    </Link>
                  </div>
                  {show && (
                    <div id="myDropdown" className="dropdown-content">
                      {loginUserRole == "Super Admin" || loginUserRole == "Vendor" ? (
                        <div className={pathname == "/add-product" ? "active menuDiv" : "menuDiv"}>
                          <Link className="linkText" href="/add-product">
                            <Image src={StarIcon} alt="StarIcon" />
                            Add Product
                          </Link>
                        </div>
                      ) : (
                        ""
                      )}
                      {loginUserRole == "Super Admin" ||
                      loginUserRole == "Account Manager" ||
                      loginUserRole == "Vendor" ||
                      loginUserRole == "Employee" ? (
                        <div className={pathname == "/product" ? "active menuDiv" : "menuDiv"}>
                          <Link className="linkText" href="/product">
                            <Image src={StarIcon} alt="StarIcon" />
                            Products
                          </Link>
                        </div>
                      ) : (
                        ""
                      )}
                      {loginUserRole == "Super Admin" ||
                      loginUserRole == "Account Manager" ||
                      loginUserRole == "Vendor" ? (
                        <div className={pathname == "/category" ? "active menuDiv" : "menuDiv"}>
                          <Link className="linkText" href="/category">
                            <Image src={StarIcon} alt="StarIcon" />
                            Category
                          </Link>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                </div>

                <div className={pathname == "/billing" ? "active menuDiv" : "menuDiv"}>
                  <Link className="linkText" href="/billing">
                    <Image src={BillingIcon} alt="BillingIcon" />
                    Billing
                  </Link>
                </div>
                <div className={pathname == "/report" ? "active menuDiv" : "menuDiv"}>
                  <Link className="linkText" href="/report">
                    <Image src={ReportIcon} alt="ReportIcon" />
                    Report
                  </Link>
                </div>
                <div className={pathname == "/payment-plan" ? "active menuDiv" : "menuDiv"}>
                  <Link className="linkText" href="/payment-plan">
                    <Image src={PaymentPlanIcon} alt="PaymentPlanIcon" />
                    Payment Plan
                  </Link>
                </div>
                <div className="menuDiv">
                  <Link className="linkText" href="" onClick={() => setConfirmShowModal(true)}>
                    <Image src={LogoutIcon} alt="LogoutIcon" />
                    Signout
                  </Link>
                </div>
              </div>
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
