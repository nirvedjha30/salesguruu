"use client"
import { useRouter } from "next/navigation"
import "../styles/category.css"
import "../styles/table.css"
import ConfirmModal from "./ConfirmModal"
import { useState } from "react"
import Image from "next/image"
import TableDeleteIcon from "../../public/table-delete.svg"

const { NEXT_PUBLIC_url } = process.env

export default function DeleteCategory(props) {
  const router = useRouter()

  const [confirmShowModal, setConfirmShowModal] = useState(false)

  // ====================================================
  const [loginUserRole, setLoginUserRole] = useState(localStorage.getItem("role"))
  const [loginUserId, setloginUserId] = useState(localStorage.getItem("id"))
  // ====================================================

  const deleteRecord = async () => {
    setConfirmShowModal(false)
    let response = await fetch(`${NEXT_PUBLIC_url}/api/category/${props.id}`, {
      method: "delete",
      body: JSON.stringify({
        loginUserRole,
      }),
    })
    response = await response.json()
    if (response.invalidRole == false) {
      alert("User role is not valid")
    } else if (response.success) {
      alert("Category Deleted")
      router.push("/category")
    }
  }
  return loginUserRole == "Super Admin" ||
    loginUserRole == "Account Manager" ||
    loginUserRole == "Vendor" ? (
    <>
      <button className="tableDeleteBtn" onClick={() => setConfirmShowModal(true)}>
        {/* Delete */}
        <Image src={TableDeleteIcon} alt="TableDeleteIcon" />
      </button>
      <ConfirmModal show={confirmShowModal} onClose={() => setConfirmShowModal(false)}>
        {/* Delete Modal */}
        <div>
          <p>Are you sure you want to delete category?</p>
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
