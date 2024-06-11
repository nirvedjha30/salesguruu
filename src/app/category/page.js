"use client"
import "../../styles/category.css"
import "../../styles/add-modal.css"
import "../../styles/edit-modal.css"
import "../../styles/table.css"
import Navbar from "@/components/Navebar"
import Sidebar from "@/components/Sidebar"
import Footer from "@/components/Footer"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DeleteCategory from "@/components/DeleteCategory"
import Modal from "@/components/Modal"
import Navigation from "@/components/Navigation"
import Search from "@/components/Search"
import AddButton from "@/components/AddButton"
import ReactPaginate from "react-paginate"
import "../../styles/pagination.css"
import Image from "next/image"
import TableEditIcon from "../../../public/table-edit.svg"
import AccendingSelectArrowIcon from "../../../public/accending-select-arrow.svg"
import DecendingSelectArrowIcon from "../../../public/decending-select-arrow.svg"
import DisableSelectArrowIcon from "../../../public/disable-select-arrow.svg"

const { NEXT_PUBLIC_url } = process.env

export default function Page() {
  const router = useRouter()

  // ====================================================
  const [id, setId] = useState("")
  const [categoryName, setCategoryName] = useState("")
  const [categoryDescription, setCategoryDescription] = useState("")
  // ====================================================

  // ====================================================
  const [categoryNameError, setCategoryNameError] = useState("")
  const [categoryDescriptionError, setCategoryDescriptionError] = useState("")
  // ====================================================

  // ====================================================
  const [loginUserRole, setLoginUserRole] = useState(localStorage.getItem("role"))
  const [loginUserId, setloginUserId] = useState(localStorage.getItem("id"))
  // ====================================================

  const [categories, setCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editShawModal, setEditShowModal] = useState(false)

  const [search, setSearch] = useState("")

  const [nameAccendingOrderActive, setNameAccendingOrderActive] = useState(false)
  const [nameDecendingOrderActive, setNameDecendingOrderActive] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (
        !localStorage.getItem("id") ||
        (loginUserRole != "Super Admin" &&
          loginUserRole != "Account Manager" &&
          loginUserRole != "Vendor")
      ) {
        router.push("/")
      } else {
        if (
          loginUserRole == "Super Admin" ||
          loginUserRole == "Account Manager" ||
          loginUserRole == "Vendor"
        ) {
          const category = await getCategories()
          // setCategories(category)
          setCategories([...category].sort((a, b) => (a.categoryName < b.categoryName ? -1 : 1)))
          setNameAccendingOrderActive(true)
          setNameDecendingOrderActive(false)
        }
      }
    })()
  }, [])

  const getCategories = async () => {
    let data = await fetch(`${NEXT_PUBLIC_url}/api/category`, { cache: "no-cache" })
    data = await data.json()
    if (data.success) {
      return data.result
    } else {
      return { success: false }
    }
  }

  // ======================================================
  const addCategory = async (e) => {
    e.preventDefault()
    if (!categoryName || !categoryDescription) {
      handle()
    } else {
      let result = await fetch(`${NEXT_PUBLIC_url}/api/category`, {
        method: "POST",
        body: JSON.stringify({ categoryName, categoryDescription, loginUserRole }),
      })
      result = await result.json()
      if (result.invalidRole == false) {
        alert("User role is not valid")
      } else if (result.success) {
        alert("New Category Added")
        setCategoryName("")
        setCategoryDescription("")
      } else {
        alert("Please Enter all field")
      }
    }
  }
  // ======================================================

  // ======================================================
  const editCategory = async (_id, categoryName, categoryDescription) => {
    setEditShowModal(true)
    setId(_id)
    setCategoryName(categoryName)
    setCategoryDescription(categoryDescription)
  }

  const updateCategory = async (e) => {
    e.preventDefault()
    if (!categoryName || !categoryDescription) {
      handle()
    } else {
      let categoryId = id
      let data = await fetch(`${NEXT_PUBLIC_url}/api/category/${categoryId}`, {
        method: "PUT",
        body: JSON.stringify({ categoryName, categoryDescription, loginUserRole }),
      })
      data = await data.json()
      if (data.invalidRole == false) {
        alert("User role is not valid")
      } else if (data.success) {
        alert("Category has been Updated")
        router.push("/category")
        setEditShowModal(false)
        setId("")
        setCategoryName("")
        setCategoryDescription("")
      } else {
        alert("Please Enter all field")
      }
    }
  }

  const closeBtn = () => {
    setShowModal(false)
    setEditShowModal(false)
    setId("")
    setCategoryName("")
    setCategoryDescription("")

    setCategoryNameError("")
    setCategoryDescriptionError("")
  }

  const searchFun = (e) => {
    e.preventDefault()
    localStorage.setItem("itemsPerPage", parseInt(e.target.value))
    setTimeout(() => {
      window.location.reload()
    }, 50)
  }

  useEffect(() => {
    if (localStorage.getItem("itemsPerPage")) {
      setItemsPerPage(parseInt(localStorage.getItem("itemsPerPage")))
    } else {
      localStorage.setItem("itemsPerPage", parseInt(5))
    }
  }, [])

  // Name Accending or Decending Order
  const nameAccendingOrder = (e) => {
    e.preventDefault()
    setCategories([...categories].sort((a, b) => (a.categoryName < b.categoryName ? -1 : 1)))
    setNameAccendingOrderActive(true)
    setNameDecendingOrderActive(false)
  }

  const nameDecendingOrder = (e) => {
    e.preventDefault()
    setCategories([...categories].sort((a, b) => (a.categoryName > b.categoryName ? -1 : 1)))
    setNameDecendingOrderActive(true)
    setNameAccendingOrderActive(false)
  }

  // ===================== Pagination =========================

  const items = categories

  // const itemsPerPage = 5;

  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0)

  // Simulate fetching items from other resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage
  // console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  // const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage)

  // Invoke when the user clicks to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length
    setItemOffset(newOffset)
  }

  // ==============================================================

  // ======================================================

  const handle = () => {
    if (!categoryName) {
      setCategoryNameError("Please enter category name.")
    } else {
      setCategoryNameError("")
    }
    if (!categoryDescription) {
      setCategoryDescriptionError("Please enter category description.")
    } else {
      setCategoryDescriptionError("")
    }
  }

  const handler = (e) => {
    if (e.target.id == "category-name") {
      setCategoryName(e.target.value)
      if (e.target.value.length == 0) {
        setCategoryNameError("Please enter category name.")
      } else {
        setCategoryNameError("")
      }
    }
    if (e.target.id == "category-description") {
      setCategoryDescription(e.target.value)
      if (e.target.value.length == 0) {
        setCategoryDescriptionError("Please enter category name.")
      } else {
        setCategoryDescriptionError("")
      }
    }
  }

  return (
    <div>
      {/* <p>Category Page</p> */}
      <div className="category">
        {/* Sidebar */}
        <Sidebar />

        <div className="categorySection">
          <div className="categoryInnerSection">
            {/* Navbar */}
            <Navbar />

            {/* Navigation */}
            {/* <Navigation page="Category" /> */}

            {/* Add Category Button */}
            {(loginUserRole == "Super Admin" ||
              loginUserRole == "Account Manager" ||
              loginUserRole == "Vendor") && (
              <AddButton page="Category" name="+ Add Category" setShowModal={setShowModal} />
            )}

            {/* Search Category */}
            <Search
              search={search}
              setSearch={setSearch}
              searchFun={searchFun}
              nameAccendingOrder={nameAccendingOrder}
              nameDecendingOrder={nameDecendingOrder}
            />

            {/* Category Table */}
            <div className="tableSection">
              <div className="tableInnerSection">
                <table>
                  <thead>
                    <tr>
                      <th className="tableSerialNumber">S.No</th>
                      {/* <th>Name</th> */}
                      {nameAccendingOrderActive == false && nameDecendingOrderActive == true ? (
                        <th onClick={(e) => nameAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Name</p>
                            <Image src={DecendingSelectArrowIcon} alt="DecendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : nameAccendingOrderActive == true && nameDecendingOrderActive == false ? (
                        <th onClick={(e) => nameDecendingOrder(e)}>
                          <div className="tableDecendingOrderBtn">
                            <p>Name</p>
                            <Image src={AccendingSelectArrowIcon} alt="AccendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : (
                        <th onClick={(e) => nameAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Name</p>
                            <Image src={DisableSelectArrowIcon} alt="DisableSelectArrowIcon" />
                          </div>
                        </th>
                      )}
                      <th>Category Description</th>
                      {loginUserRole == "Super Admin" ||
                      loginUserRole == "Account Manager" ||
                      loginUserRole == "Vendor" ? (
                        <th>Action</th>
                      ) : (
                        ""
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {categories != "" ? (
                      categories
                        .filter((item) => {
                          if (search.toLowerCase() === "") {
                            return item
                          } else {
                            if (item.categoryName.toLowerCase().match(search.toLowerCase())) {
                              return item.categoryName.toLowerCase().includes(search.toLowerCase())
                            } else if (
                              item.categoryDescription.toLowerCase().match(search.toLowerCase())
                            ) {
                              return item.categoryDescription
                                .toLowerCase()
                                .includes(search.toLowerCase())
                            }
                          }
                        })
                        .slice(itemOffset, endOffset)
                        .map((item, index) => (
                          <tr key={index}>
                            <td>{endOffset - itemsPerPage + index + 1}</td>
                            <td>{item.categoryName}</td>
                            <td>{item.categoryDescription}</td>
                            {loginUserRole == "Super Admin" ||
                            loginUserRole == "Account Manager" ||
                            loginUserRole == "Vendor" ? (
                              <>
                                <td className="tableAction">
                                  <button
                                    className="tableEditBtn"
                                    onClick={() =>
                                      editCategory(
                                        item._id,
                                        item.categoryName,
                                        item.categoryDescription
                                      )
                                    }
                                  >
                                    {/* Edit */}
                                    <Image src={TableEditIcon} alt="TableEditIcon" />
                                  </button>
                                  <DeleteCategory id={item._id} />
                                </td>
                              </>
                            ) : (
                              ""
                            )}
                          </tr>
                        ))
                    ) : (
                      <tr className="no-data">
                        <td colSpan={4} align="center">
                          No Category
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="react-paginate">
              <div className="pagination-deteils">
                <p>
                  Showing {endOffset - itemsPerPage + 1} to{" "}
                  {items.length >= endOffset ? endOffset : items.length} of {items.length} entries
                </p>
              </div>
              <ReactPaginate
                breakLabel="..."
                nextLabel="Next"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="Previous"
                renderOnZeroPageCount={null}
              />
            </div>
          </div>
          <Footer />
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal show={showModal} onClose={() => closeBtn()}>
        {/* Add Category Form */}
        <div className="addTitle">
          <p>Add Category</p>
        </div>
        <div className="addFormSection">
          <div className="addFormInnerSection">
            <form className="addForm">
              <div className="addFormInputSection">
                <div className="addFormInputThirdSection">
                  <label>Category Name</label>
                  <input
                    type="text"
                    className={categoryNameError && "errorBorder"}
                    id="category-name"
                    value={categoryName}
                    onChange={(e) => handler(e)}
                    placeholder="Enter a category name"
                  />
                  {categoryNameError && <p className="errorMsg">{categoryNameError}</p>}
                  <label>Description</label>
                  <input
                    type="text"
                    className={categoryDescriptionError && "errorBorder"}
                    id="category-description"
                    value={categoryDescription}
                    onChange={(e) => handler(e)}
                    placeholder="Enter a category description"
                  />
                  {categoryDescriptionError && (
                    <p className="errorMsg">{categoryDescriptionError}</p>
                  )}
                </div>
              </div>
              <div className="addModalBtnSection">
                <button type="submit" onClick={(e) => addCategory(e)} className="addModalBtn">
                  + Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      {/* Update Category Modal */}
      <Modal show={editShawModal} onClose={() => closeBtn()}>
        <div className="updateTitle">
          <p>Update Category</p>
        </div>
        <div className="updateFormSection">
          <div className="updateFormInnerSection">
            <form className="updateForm">
              <div className="updateFormInputSection">
                <div className="updateFormInputThirdSection">
                  <label>Category Name</label>
                  <input
                    type="text"
                    className={categoryNameError && "errorBorder"}
                    id="category-name"
                    value={categoryName}
                    onChange={(e) => handler(e)}
                    placeholder="Enter a category name"
                  />
                  {categoryNameError && <p className="errorMsg">{categoryNameError}</p>}
                  <label>Description</label>
                  <input
                    type="text"
                    className={categoryDescriptionError && "errorBorder"}
                    id="category-description"
                    value={categoryDescription}
                    onChange={(e) => handler(e)}
                    placeholder="Enter a category description"
                  />
                  {categoryDescriptionError && (
                    <p className="errorMsg">{categoryDescriptionError}</p>
                  )}
                </div>
              </div>
              <div className="updateModalBtnSection">
                <button type="submit" onClick={(e) => updateCategory(e)} className="updateModalBtn">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  )
}
