import "../styles/add-button.css"
export default function AddButton(props) {
  return (
    <div className="addSection">
      <div className="addInnerSection">
        <p>{props.page}</p>
        <button className="addBtn" onClick={() => props.setShowModal(true)}>
          {props.name}
        </button>
      </div>
    </div>
  )
}
