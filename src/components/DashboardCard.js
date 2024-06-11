import Image from "next/image"
import ProfileIcon from "../../public/profile.svg"
import Link from "next/link"
// import Particles from "react-particles-js";

const { NEXT_PUBLIC_url } = process.env

export default function DashboardCard(props) {
  return (
    <div className={`${props.cardClassName} card`}>
      <div className={` cardTotal`}>
        <div className="cardTotalInnerSection">
          <div className="cardTotalDetail">
            {/* <p>0</p> */}
            <p className="totalNumber">{props.total}</p>
            <p>Total {props.cardName}</p>
          </div>
          <div className="cardTotalIcon">{/* <Image src={ProfileIcon} alt="ProfileIcon" /> */}</div>
        </div>
      </div>
      <div className={`${props.moreInfoClassName} cardMoreInfo`}>
        {props.moreInfoLink != "" ? <Link href={props.moreInfoLink}>More Info</Link> : ""}
      </div>
    </div>
  )
}
