import Image from "next/image"
import GreenTickIcon from "../../public/success-green-tick.svg"
import "../styles/payment-plan-card.css"

const { NEXT_PUBLIC_url } = process.env

export default function PaymentPlanCard(props) {
  return (
    <div className="paymentPlanCard">
      <div className="paymentPlanCardPriceSection">
        <p>
          &#8377;200
          <br />
          <small>/month</small>
        </p>
      </div>
      <div className="paymentPlanCardHeadingSection">
        <p>{props.cardName}</p>
      </div>
      <div className="paymentPlanCardSpecialPlan">
        <p>Our Special Plan</p>
      </div>
      <div className="paymentPlanCardServices">
        <div className="point">
          <Image src={GreenTickIcon} alt="GreenTickIcon" />
          <p>Good Service</p>
        </div>
        <div className="point">
          <Image src={GreenTickIcon} alt="GreenTickIcon" />
          <p>Customer Support</p>
        </div>
        <div className="point">
          <Image src={GreenTickIcon} alt="GreenTickIcon" />
          <p>24*7 Help</p>
        </div>
      </div>
      <div className="paymentPlanCardBtn">
        <button>Buy Plan</button>
      </div>
    </div>
  )
}
