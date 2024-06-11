"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import "../styles/profile.css"
import "../styles/table.css"
import ConfirmModal from "./ConfirmModal"
import DeleteIcon from "../../public/delete.svg"
import { useState } from "react"

const { NEXT_PUBLIC_url } = process.env

export default function DeleteLoginUser(props) {
  const router = useRouter()

  const [confirmShowModal, setConfirmShowModal] = useState(false)

  // ====================================================
  const [loginUserRole, setLoginUserRole] = useState(localStorage.getItem("role"))
  const [loginUserId, setloginUserId] = useState(localStorage.getItem("id"))
  // ====================================================

  const deleteRecord = async () => {
    setConfirmShowModal(false)
    let response = await fetch(`${NEXT_PUBLIC_url}/api/super-admin/${props.id}`, {
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
  return loginUserRole == "Super Admin" ||
    loginUserRole == "Account Manager" ||
    loginUserRole == "Vendor" ? (
    <>
      <button className="tableDeleteBtn" onClick={() => setConfirmShowModal(true)}>
        {/* <Image className="deleteIcon" src={DeleteIcon} alt="DeleteIcon" /> */}
        Delete Account
      </button>
      <ConfirmModal show={confirmShowModal} onClose={() => setConfirmShowModal(false)}>
        {/* Delete Modal */}
        <div>
          <p>Are you sure you want to delete account?</p>
          <div className="confirmBtn">
            <button className="yesBtn" onClick={() => deleteRecord()}>
              Yes
            </button>
            <button className="noBtn" onClick={() => setConfirmShowModal(false)}>
              No
            </button>
          </div>
        </div>
      </ConfirmModal>
    </>
  ) : (
    ""
  )
}
