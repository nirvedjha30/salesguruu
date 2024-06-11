"use client"
import "../../styles/account-manager.css"
import "../../styles/payment-plan.css"
import "../../styles/table.css"
import Navbar from "@/components/Navebar"
import Sidebar from "@/components/Sidebar"
import Footer from "@/components/Footer"
import Navigation from "@/components/Navigation"
import PaymentPlanCard from "@/components/PaymentPlanCard"

const { NEXT_PUBLIC_url } = process.env

export default function Page() {
  return (
    <div>
      {/* <p>Account Manager Page</p> */}
      <div className="paymentPlan">
        {/* Sidebar */}
        <Sidebar />

        <div className="paymentPlanSection">
          <div className="paymentPlanInnerSection">
          {/* Navbar */}
          <Navbar />

          {/* Navigation */}
          <Navigation page="Payment Plan" />

          {/* Payment Plan Heading */}
          <div className="paymentPlanHeadingSection">
            <div className="paymentPlanHeadingInnerSection">
              <p className="paymentPlanHeading">Select Our Plan</p>
            </div>
          </div>

          <div className="paymentPlanCardSection">
            <div className="paymentPlanCardInnerSection">
              <PaymentPlanCard cardName="Regular" />
              <PaymentPlanCard cardName="Advaed" />
              <PaymentPlanCard cardName="Business" />
            </div>
          </div>
          </div>
          <Footer />
        </div>
      </div>
      
    </div>
  )
}
