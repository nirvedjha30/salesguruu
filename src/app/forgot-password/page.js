"use client"
import Image from "next/image"
import "../../styles/forgot-password.css"
import Tracking from "./../../../public/tracking-icon.jpg"
import Banner from "./../../../public/bann_img1.png"
import { useState } from "react"

const { NEXT_PUBLIC_url } = process.env

export default function Page() {
  const [email, setEmail] = useState("")

  const sendEmail = (e) => {
    e.preventDefault()
  }

  return (
    <div className="forgotPassword">
      <div className="forgotPasswordFormSection">
        <div className="forgotPasswordFormInnerSection">
          <Image className="trackingIcon" src={Tracking} alt="Tracking" />
          <div className="forgotPasswordForm">
            <h1>Forgot password?</h1>
            <p>Please enter your email address below</p>
            <form>
              <div className="input">
                <div className="inputFiled">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>
              </div>
              <button type="submit" onClick={(e) => sendEmail(e)} className="forgotPasswordBtn">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="forgotPasswordBanner">
        <Image src={Banner} alt="Banner" />
      </div>
    </div>
  )
}
