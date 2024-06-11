"use client"
import { useEffect, useState } from "react"
import styles from "../styles/Modal.module.css"
import Link from "next/link"

const { NEXT_PUBLIC_url } = process.env

export default function Modal({ show, onClose, modal, children }) {
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
        <div className={styles.header}>
          <Link href="#" className={styles.close} onClick={(e) => handleClose(e)}>
            X
          </Link>
        </div>
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
