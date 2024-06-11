"use client"
import Image from "next/image"
import "../styles/login.css"
import Tracking from "./../../public/tracking-icon.jpg"
import Banner from "./../../public/bann_img2.png"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const { NEXT_PUBLIC_url } = process.env

export default function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")

  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [roleError, setRoleError] = useState("")

  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem("id")) {
      router.push("/profile")
    }
  }, [])

  const login = async (e) => {
    e.preventDefault()
    if (!email || !password || !role) {
      handle()
    } else {
      let result = await fetch(`${NEXT_PUBLIC_url}/api/super-admin/login`, {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      })
      result = await result.json()
      const user = result.result
      if (result && result.success) {
        alert("You are Successfully Login :)")
        localStorage.setItem("id", user._id)
        localStorage.setItem("name", user.name)
        localStorage.setItem("email", user.email)
        localStorage.setItem("password", user.password)
        localStorage.setItem("role", user.role)
        localStorage.setItem("companyName", user.companyName)
        localStorage.setItem("address", user.address)
        localStorage.setItem("countryName", user.countryName)
        localStorage.setItem("stateName", user.stateName)
        localStorage.setItem("cityName", user.cityName)
        localStorage.setItem("mobileNumber", user.mobileNumber)
        router.push("/profile")
      } else {
        employeeLogin()
      }
    }
  }

  const employeeLogin = async () => {
    let result = await fetch(`${NEXT_PUBLIC_url}/api/employee/employee-login`, {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    })
    result = await result.json()
    const user = result.result
    if (result && result.success) {
      alert("You are Successfully Login :)")
      localStorage.setItem("id", user._id)
      localStorage.setItem("name", user.name)
      localStorage.setItem("email", user.email)
      localStorage.setItem("password", user.password)
      localStorage.setItem("superAdminId", user.superAdminId)
      localStorage.setItem("role", user.role)
      localStorage.setItem("mobileNumber", user.mobileNumber)
      localStorage.setItem("gender", user.gender)
      localStorage.setItem("status", user.status)
      router.push("/profile")
    } else {
      alert("Please Enter Valid Email & Password")
    }
  }

  const handle = () => {
    if (!email) {
      setEmailError("Please enter email address.")
    } else {
      setEmailError("")
    }
    if (!password) {
      setPasswordError("Please enter password.")
    } else {
      setPasswordError("")
    }
    if (!role) {
      setRoleError("Please select role.")
    } else {
      setRoleError("")
    }
  }

  const handler = (e) => {
    if (e.target.id == "email") {
      setEmail(e.target.value)
      if (e.target.value.length == 0) {
        setEmailError("Please enter email address.")
      } else {
        setEmailError("")
      }
    }
    if (e.target.id == "password") {
      setPassword(e.target.value)
      if (e.target.value.length == 0) {
        setPasswordError("Please enter password.")
      } else {
        setPasswordError("")
      }
    }
    if (e.target.id == "role") {
      setRole(e.target.value)
      if (e.target.value.length == 0) {
        setRoleError("Please select role.")
      } else {
        setRoleError("")
      }
    }
  }

  return (
    <main>
      <div className="login">
        <div className="loginFormSection">
          <div className="loginFormInnerSection">
            <Image className="trackingIcon" src={Tracking} alt="Tracking" />
            <div className="loginForm">
              <h1>Log in</h1>
              <form>
                <table>
                  <tbody>
                    <tr className="input">
                      <td className="inputLabel">
                        <label>Username:</label>
                      </td>
                      <td className="inputFiled">
                        <input
                          type="text"
                          className={emailError && "errorBorder"}
                          id="email"
                          value={email}
                          onChange={(e) => handler(e)}
                        />
                        {emailError && <p className="errorMsg">{emailError}</p>}
                      </td>
                    </tr>
                    <tr className="input">
                      <td className="inputLabel">
                        <label>Password:</label>
                      </td>
                      <td className="inputFiled">
                        <input
                          type="password"
                          className={passwordError && "errorBorder"}
                          id="password"
                          value={password}
                          onChange={(e) => handler(e)}
                        />
                        {passwordError && <p className="errorMsg">{passwordError}</p>}
                      </td>
                    </tr>
                    <tr className="input">
                      <td className="inputLabel">
                        <label>Role:</label>
                      </td>
                      <td className="inputFiled">
                        <select
                          className={roleError && "errorBorder"}
                          id="role"
                          value={role}
                          onChange={(e) => handler(e)}
                          placeholder="Select a Role"
                        >
                          <option></option>
                          <option value="Super Admin">Super Admin</option>
                          <option value="Account Manager">Account Manager</option>
                          <option value="Vendor">Vendor</option>
                          <option value="Employee">Employee</option>
                        </select>
                        {roleError && <p className="errorMsg">{roleError}</p>}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="forgotPassword">
                  <Link href="./forgot-password">Forgot password?</Link>
                </div>
                <button className="loginBtn" onClick={(e) => login(e)}>
                  Login
                </button>
                <div className="forgotPassword">
                  <Link href="./registration">Signup</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="loginBanner">
          <Image src={Banner} alt="Banner" />
        </div>
      </div>
    </main>
  )
}
