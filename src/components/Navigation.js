import "../styles/navigation.css"
export default function Navigation(props) {
  return (
    <div className="navigation">
      <div className="navigationInnerSection">
        {/* <p>
          Dashboard / <b>{props.page}</b>
        </p> */}
        <p>{props.page}</p>
      </div>
    </div>
  )
}
