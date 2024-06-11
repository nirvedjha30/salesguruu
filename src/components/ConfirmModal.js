"use client"
import { useEffect, useState } from "react"
import styles from "../styles/ConfirmModal.module.css"

const { NEXT_PUBLIC_url } = process.env

export default function ConfirmModal({ show, onClose, children }) {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  const handleClose = (e) => {
    e.preventDefault()
    onClose()
  }

  const modalContent = show ? (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  ) : null

  if (isBrowser) {
    return modalContent
  } else {
    return null
  }
}
