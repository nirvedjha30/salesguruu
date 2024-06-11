"use client"
import "../../styles/billing.css"
import "../../styles/table.css"
import Navbar from "@/components/Navebar"
import Sidebar from "@/components/Sidebar"
import Footer from "@/components/Footer"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Navigation from "@/components/Navigation"
import Search from "@/components/Search"

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
      {/* <p>Billing Page</p> */}
      <div className="billing">
        {/* Sidebar */}
        <Sidebar />

        <div className="billingSection">
          <div className="billingInnerSection">
          {/* Navbar */}
          <Navbar />

          {/* Navigation */}
          <Navigation page="Billing" />

          {/* Billing Table Navigation Section */}
          <div className="billingNavigationSection">
            <div className="billingNavigationInnerSection">
              <Link href="">Product</Link>
              <Link href="">Create Bill</Link>
              <Link href="">Billing History</Link>
            </div>
          </div>

          {/* Search Billing */}
          <Search />

          {/* Billing Table */}
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
