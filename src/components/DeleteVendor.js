"use client"
import { useRouter } from "next/navigation"
import "../styles/vendor.css"
import "../styles/table.css"
import ConfirmModal from "./ConfirmModal"
import { useState } from "react"
import Image from "next/image"
import TableDeleteIcon from "../../public/table-delete.svg"

const { NEXT_PUBLIC_url } = process.env

export default function DeleteVendor(props) {
  const router = useRouter()

  const [confirmShowModal, setConfirmShowModal] = useState(false)

  // ====================================================
  const [loginUserRole, setLoginUserRole] = useState(localStorage.getItem("role"))
  const [loginUserId, setloginUserId] = useState(localStorage.getItem("id"))
  // ====================================================

  const deleteRecord = async () => {
    setConfirmShowModal(false)
    let response = await fetch(`${NEXT_PUBLIC_url}/api/super-admin/vendor/${props.id}`, {
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
      if (loginUserRole == "Super Admin" || loginUserRole == "Account Manager") {
        alert("Vendor Deleted")
        router.push("/vendor")
      } else if (loginUserRole == "Vendor") {
        alert("You are Successfully Delete your Vendor Account :)")
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
  return (
    <>
      <button className="tableDeleteBtn" onClick={() => setConfirmShowModal(true)}>
        {/* Delete */}
        <Image src={TableDeleteIcon} alt="TableDeleteIcon" />
      </button>
      <ConfirmModal show={confirmShowModal} onClose={() => setConfirmShowModal(false)}>
        {/* Delete Modal */}
        <div>
          <p>Are you sure you want to delete vendor?</p>
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
  )
}
