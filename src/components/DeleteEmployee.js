"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import "../styles/employee.css"
import "../styles/table.css"
import ConfirmModal from "./ConfirmModal"
import DeleteIcon from "../../public/delete.svg"
import { useState } from "react"
import TableDeleteIcon from "../../public/table-delete.svg"

const { NEXT_PUBLIC_url } = process.env

export default function DeleteEmployee(props) {
  const router = useRouter()

  const [confirmShowModal, setConfirmShowModal] = useState(false)

  // ====================================================
  const [loginUserRole, setLoginUserRole] = useState(localStorage.getItem("role"))
  const [loginUserId, setloginUserId] = useState(localStorage.getItem("id"))
  // ====================================================

  const deleteRecord = async () => {
    setConfirmShowModal(false)
    let response = await fetch(`${NEXT_PUBLIC_url}/api/employee/${props.id}`, {
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
  return (
    <>
      {props.user != "loginUserDelete" ? (
        <button className="tableDeleteBtn" onClick={() => setConfirmShowModal(true)}>
          {/* Delete */}
          <Image src={TableDeleteIcon} alt="TableDeleteIcon" />
        </button>
      ) : (
        <button onClick={() => setConfirmShowModal(true)}>
          {/* <Image className="deleteIcon" src={DeleteIcon} alt="DeleteIcon" /> */}
          Delete Account
        </button>
      )}

      <ConfirmModal show={confirmShowModal} onClose={() => setConfirmShowModal(false)}>
        {/* Delete Modal */}
        <div>
          <p>Are you sure you want to delete employee?</p>
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
