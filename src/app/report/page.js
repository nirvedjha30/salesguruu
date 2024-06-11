"use client"
import "../../styles/report.css"
import "../../styles/table.css"
import Navbar from "@/components/Navebar"
import Sidebar from "@/components/Sidebar"
import Footer from "@/components/Footer"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Navigation from "@/components/Navigation"
import Search from "@/components/Search"
import Image from "next/image"
import TableEditIcon from "../../../public/table-edit.svg"
import TableDeleteIcon from "../../../public/table-delete.svg"

const { NEXT_PUBLIC_url } = process.env

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    if (!localStorage.getItem("id")) {
      router.push("/")
    }
  }, [])

  return (
    <div>
      {/* <p>Report Page</p> */}
      <div className="report">
        {/* Sidebar */}
        <Sidebar />

        <div className="reportSection">
          <div className="reportInnerSection">
            {/* Navbar */}
            <Navbar />

            {/* Navigation */}
            <Navigation page="Report" />

            {/* Search Report */}
            <Search />

            {/* Report Table */}
            <div className="tableSection">
              <div className="tableInnerSection">
                <table>
                  <thead>
                    <tr>
                      <th className="tableSerialNumber">S.No</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Vendor</th>
                      <th>Quantity</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>One Plus 11R</td>
                      <td>45000</td>
                      <td>Nirved</td>
                      <td>1</td>
                      <td>Description</td>
                      <td className="tableAction">
                        <Link className="tableEditBtn" href="">
                          {/* Edit */}
                          <Image src={TableEditIcon} alt="TableEditIcon" />
                        </Link>
                        <button className="tableDeleteBtn">
                          {/* Delete */}
                          <Image src={TableDeleteIcon} alt="TableDeleteIcon" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
