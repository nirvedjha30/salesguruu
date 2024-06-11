"use client"
import { useRouter } from "next/navigation"
import "../styles/account-manager.css"
import "../styles/table.css"
import ConfirmModal from "./ConfirmModal"
import { useState } from "react"
import Image from "next/image"
// import DeleteIcon from "../../public/delete.svg"
import TableDeleteIcon from "../../public/table-delete.svg"

const { NEXT_PUBLIC_url } = process.env

export default function DeleteAccountManager(props) {
  const router = useRouter()

  const [confirmShowModal, setConfirmShowModal] = useState(false)

  // ====================================================
  const [loginUserRole, setLoginUserRole] = useState(localStorage.getItem("role"))
  const [loginUserId, setloginUserId] = useState(localStorage.getItem("id"))
  // ====================================================

  const deleteRecord = async () => {
    setConfirmShowModal(false)
    let response = await fetch(`${NEXT_PUBLIC_url}/api/super-admin/account-manager/${props.id}`, {
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
      if (loginUserRole == "Super Admin") {
        alert("Account Manager Deleted")
        router.push("/account-manager")
      } else if (loginUserRole == "Account Manager") {
        alert("You are Successfully Delete your Account Manager Account :)")
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
  return loginUserRole == "Super Admin" || loginUserRole == "Account Manager" ? (
    <>
      <button className="tableDeleteBtn" onClick={() => setConfirmShowModal(true)}>
        {/* Delete */}
        <Image src={TableDeleteIcon} alt="TableDeleteIcon" />
      </button>
      <ConfirmModal show={confirmShowModal} onClose={() => setConfirmShowModal(false)}>
        {/* Delete Modal */}
        <div>
          <p>Are you sure you want to delete account manager?</p>
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
