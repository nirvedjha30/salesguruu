"use client"
import "../../styles/product.css"
import "../../styles/edit-modal.css"
import "../../styles/add-modal.css"
import "../../styles/table.css"
import Navbar from "@/components/Navebar"
import Sidebar from "@/components/Sidebar"
import Footer from "@/components/Footer"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DeleteProduct from "@/components/DeleteProduct"
import Modal from "@/components/Modal"
import Select from "@/components/Select"
import Navigation from "@/components/Navigation"
import Search from "@/components/Search"
import AddButton from "@/components/AddButton"
import ReactPaginate from "react-paginate"
import "../../styles/pagination.css"
import Image from "next/image"
import TableEditIcon from "../../../public/table-edit.svg"
import TableDisableEditIcon from "../../../public/table-disable-edit.svg"
import TableDisableDeleteIcon from "../../../public/table-disable-delete.svg"
import AccendingSelectArrowIcon from "../../../public/accending-select-arrow.svg"
import DecendingSelectArrowIcon from "../../../public/decending-select-arrow.svg"
import DisableSelectArrowIcon from "../../../public/disable-select-arrow.svg"

const { NEXT_PUBLIC_url } = process.env

var vendorProductCount = 0

export default function Page() {
  const router = useRouter()

  vendorProductCount = 0

  console.log("vendorProductCount", vendorProductCount)

  // ====================================================
  const [loginUserRole, setLoginUserRole] = useState(localStorage.getItem("role"))
  const [loginUserId, setloginUserId] = useState(localStorage.getItem("id"))
  const [loginUserEmail, setLoginUserEmail] = useState(localStorage.getItem("email"))
  // ====================================================

  // ===========================================
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [quantity, setQuantity] = useState("")
  const [vendorId, setVendorId] = useState(loginUserRole == "Vendor" ? loginUserEmail : "")
  const [category, setCategory] = useState("")
  // ===========================================

  // ===========================================
  const [nameError, setNameError] = useState("")
  const [priceError, setPriceError] = useState("")
  const [productDescriptionError, setProductDescriptionError] = useState("")
  const [quantityError, setQuantityError] = useState("")
  const [vendorIdError, setVendorIdError] = useState("")
  const [categoryError, setCategoryError] = useState("")
  // ===========================================

  const [products, setProducts] = useState([])
  const [filterProducts, setFilterProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editShawModal, setEditShowModal] = useState(false)

  const [search, setSearch] = useState("")

  // =================Accending or Decending Order====================
  const [nameAccendingOrderActive, setNameAccendingOrderActive] = useState(false)
  const [nameDecendingOrderActive, setNameDecendingOrderActive] = useState(false)
  const [priceAccendingOrderActive, setPriceAccendingOrderActive] = useState(false)
  const [priceDecendingOrderActive, setPriceDecendingOrderActive] = useState(false)
  const [vendorIdAccendingOrderActive, setVendorIdAccendingOrderActive] = useState(false)
  const [vendorIdDecendingOrderActive, setVendorIdDecendingOrderActive] = useState(false)
  const [quantityAccendingOrderActive, setQuantityAccendingOrderActive] = useState(false)
  const [quantityDecendingOrderActive, setQuantityDecendingOrderActive] = useState(false)
  // =================================================================

  // ========================Category Filter==============================
  const [categoryFilterActive, setCategoryFilterActive] = useState("")
  const [allCategoryFilterActive, setAllCategoryFilterActive] = useState(true)
  // ===================================================================

  useEffect(() => {
    ;(async () => {
      if (
        !localStorage.getItem("id") ||
        (loginUserRole != "Super Admin" &&
          loginUserRole != "Account Manager" &&
          loginUserRole != "Vendor" &&
          loginUserRole != "Employee")
      ) {
        router.push("/")
      } else {
        if (
          loginUserRole == "Super Admin" ||
          loginUserRole == "Account Manager" ||
          loginUserRole == "Vendor" ||
          loginUserRole == "Employee"
        ) {
          const product = await getProducts()
          // setProducts(product)
          setProducts([...product].sort((a, b) => (a.name < b.name ? -1 : 1)))
          setFilterProducts([...product].sort((a, b) => (a.name < b.name ? -1 : 1)))
          setNameAccendingOrderActive(true)
          setNameDecendingOrderActive(false)
        }
      }
    })()
  }, [])

  const getProducts = async () => {
    let data = await fetch(`${NEXT_PUBLIC_url}/api/product`, {
      cache: "no-cache",
    })
    data = await data.json()
    if (data.success) {
      return data.result
    } else {
      return { success: false }
    }
  }

  // ======================================================
  const addProduct = async (e) => {
    e.preventDefault()
    if (!name || !price || !productDescription || !quantity || !vendorId || !category) {
      handle()
    } else {
      let result = await fetch(`${NEXT_PUBLIC_url}/api/product`, {
        method: "POST",
        body: JSON.stringify({
          name,
          price,
          productDescription,
          quantity,
          vendorId,
          category,
          loginUserRole,
        }),
      })
      result = await result.json()
      if (result.invalidRole == false) {
        alert("User role is not valid")
      } else if (result.success) {
        alert("New Product Added")
        setName("")
        setPrice("")
        setProductDescription("")
        setQuantity("")
        setVendorId(loginUserRole == "Vendor" ? loginUserEmail : "")
        setCategory("")
      } else {
        alert("Please Enter all field")
      }
    }
  }
  // ======================================================

  // ======================================================
  const editProduct = async (
    _id,
    name,
    price,
    productDescription,
    quantity,
    vendorId,
    category
  ) => {
    setEditShowModal(true)
    setId(_id)
    setName(name)
    setPrice(price)
    setProductDescription(productDescription)
    setQuantity(quantity)
    setVendorId(vendorId)
    setCategory(category)
  }

  const updateProduct = async (e) => {
    e.preventDefault()
    if (!name || !price || !productDescription || !quantity || !vendorId || !category) {
      handle()
    } else {
      let productId = id
      let data = await fetch(`${NEXT_PUBLIC_url}/api/product/${productId}`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          price,
          productDescription,
          quantity,
          vendorId,
          category,
          loginUserRole,
          loginUserEmail,
        }),
      })
      data = await data.json()
      if (data.invalidRole == false) {
        alert("User role is not valid")
      } else if (data.invalidUser == false) {
        alert("User is not valid")
      } else if (data.success) {
        alert("Product has been Updated")
        router.push("/product")
        setEditShowModal(false)
        setId("")
        setName("")
        setPrice("")
        setProductDescription("")
        setQuantity("")
        setVendorId(loginUserRole == "Vendor" ? loginUserEmail : "")
        setCategory("")
      } else {
        alert("Please Enter all field")
      }
    }
  }

  const closeBtn = () => {
    setShowModal(false)
    setEditShowModal(false)
    setId("")
    setName("")
    setPrice("")
    setProductDescription("")
    setQuantity("")
    setVendorId(loginUserRole == "Vendor" ? loginUserEmail : "")
    setCategory("")

    setNameError("")
    setPriceError("")
    setProductDescriptionError("")
    setQuantityError("")
    setVendorIdError("")
    setCategoryError("")
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

  // =====================Name Accending or Decending Order====================
  const nameAccendingOrder = (e) => {
    e.preventDefault()
    setProducts([...products].sort((a, b) => (a.name < b.name ? -1 : 1)))
    setNameAccendingOrderActive(true)
    setNameDecendingOrderActive(false)

    setPriceAccendingOrderActive(false)
    setPriceDecendingOrderActive(false)
    setVendorIdAccendingOrderActive(false)
    setVendorIdDecendingOrderActive(false)
    setQuantityAccendingOrderActive(false)
    setQuantityDecendingOrderActive(false)
  }

  const nameDecendingOrder = (e) => {
    e.preventDefault()
    setProducts([...products].sort((a, b) => (a.name > b.name ? -1 : 1)))
    setNameDecendingOrderActive(true)
    setNameAccendingOrderActive(false)

    setPriceDecendingOrderActive(false)
    setPriceAccendingOrderActive(false)
    setVendorIdDecendingOrderActive(false)
    setVendorIdAccendingOrderActive(false)
    setQuantityDecendingOrderActive(false)
    setQuantityAccendingOrderActive(false)
  }
  // ========================================================================

  // =====================Price Accending or Decending Order====================
  const priceAccendingOrder = (e) => {
    e.preventDefault()
    setProducts([...products].sort((a, b) => (a.price < b.price ? -1 : 1)))
    setPriceAccendingOrderActive(true)
    setPriceDecendingOrderActive(false)

    setNameAccendingOrderActive(false)
    setNameDecendingOrderActive(false)
    setVendorIdAccendingOrderActive(false)
    setVendorIdDecendingOrderActive(false)
    setQuantityAccendingOrderActive(false)
    setQuantityDecendingOrderActive(false)
  }

  const priceDecendingOrder = (e) => {
    e.preventDefault()
    setProducts([...products].sort((a, b) => (a.price > b.price ? -1 : 1)))
    setPriceDecendingOrderActive(true)
    setPriceAccendingOrderActive(false)

    setNameDecendingOrderActive(false)
    setNameAccendingOrderActive(false)
    setVendorIdDecendingOrderActive(false)
    setVendorIdAccendingOrderActive(false)
    setQuantityDecendingOrderActive(false)
    setQuantityAccendingOrderActive(false)
  }
  // ========================================================================

  // =====================(vendorId) Accending or Decending Order====================
  const vendorIdAccendingOrder = (e) => {
    e.preventDefault()
    setProducts([...products].sort((a, b) => (a.vendorId < b.vendorId ? -1 : 1)))
    setVendorIdAccendingOrderActive(true)
    setVendorIdDecendingOrderActive(false)
    
    setNameAccendingOrderActive(false)
    setNameDecendingOrderActive(false)
    setPriceAccendingOrderActive(false)
    setPriceDecendingOrderActive(false)
    setQuantityAccendingOrderActive(false)
    setQuantityDecendingOrderActive(false)
  }

  const vendorIdDecendingOrder = (e) => {
    e.preventDefault()
    setProducts([...products].sort((a, b) => (a.vendorId > b.vendorId ? -1 : 1)))
    setVendorIdDecendingOrderActive(true)
    setVendorIdAccendingOrderActive(false)

    setNameDecendingOrderActive(false)
    setNameAccendingOrderActive(false)
    setPriceDecendingOrderActive(false)
    setPriceAccendingOrderActive(false)
    setQuantityDecendingOrderActive(false)
    setQuantityAccendingOrderActive(false)
  }
  // ========================================================================

  // =====================Quantity Accending or Decending Order====================
  const quantityAccendingOrder = (e) => {
    e.preventDefault()
    setProducts([...products].sort((a, b) => (a.quantity < b.quantity ? -1 : 1)))
    setQuantityAccendingOrderActive(true)
    setQuantityDecendingOrderActive(false)
    
    setNameAccendingOrderActive(false)
    setNameDecendingOrderActive(false)
    setPriceAccendingOrderActive(false)
    setPriceDecendingOrderActive(false)
    setVendorIdAccendingOrderActive(false)
    setVendorIdDecendingOrderActive(false)
  }

  const quantityDecendingOrder = (e) => {
    e.preventDefault()
    setProducts([...products].sort((a, b) => (a.quantity > b.quantity ? -1 : 1)))
    setQuantityDecendingOrderActive(true)
    setQuantityAccendingOrderActive(false)
    
    setNameDecendingOrderActive(false)
    setNameAccendingOrderActive(false)
    setPriceDecendingOrderActive(false)
    setPriceAccendingOrderActive(false)
    setVendorIdDecendingOrderActive(false)
    setVendorIdAccendingOrderActive(false)
  }
  // ========================================================================

  // =====================Category Filter====================
  const categoryFilter = (e,categoryName) => {
    e.preventDefault()
    setProducts([...filterProducts].filter((a) => a.category == categoryName))
    setCategoryFilterActive(categoryName)
    setAllCategoryFilterActive(false)
  }

  const allCategoryFilter = (e) => {
    e.preventDefault()
    setProducts([...filterProducts])
    setAllCategoryFilterActive(true)
    setCategoryFilterActive("")
  }
  // ========================================================================

  // ===================== Pagination =========================

  const items = products

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
    vendorProductCount = 0
    const newOffset = (event.selected * itemsPerPage) % items.length
    setItemOffset(newOffset)
  }

  // ==============================================================

  const handle = () => {
    if (!name) {
      setNameError("Please enter product name.")
    } else {
      setNameError("")
    }
    if (!price) {
      setPriceError("Please enter price.")
    } else {
      setPriceError("")
    }
    if (!productDescription) {
      setProductDescriptionError("Please enter product description.")
    } else {
      setProductDescriptionError("")
    }
    if (!quantity) {
      setQuantityError("Please enter quantity.")
    } else {
      setQuantityError("")
    }
    if (!vendorId) {
      setVendorIdError("Please select vendor Id.")
    } else {
      setVendorIdError("")
    }
    if (!category) {
      setCategoryError("Please select category.")
    } else {
      setCategoryError("")
    }
  }

  const handler = (e) => {
    if (e.target.id == "name") {
      setName(e.target.value)
      if (e.target.value.length == 0) {
        setNameError("Please enter product name.")
      } else {
        setNameError("")
      }
    }
    if (e.target.id == "price") {
      setPrice(e.target.value)
      if (e.target.value.toString().length == 0) {
        setPriceError("Please enter price.")
      } else {
        setPriceError("")
      }
    }
    if (e.target.id == "product-description") {
      setProductDescription(e.target.value)
      if (e.target.value.length == 0) {
        setProductDescriptionError("Please enter product description.")
      } else {
        setProductDescriptionError("")
      }
    }
    if (e.target.id == "quantity") {
      setQuantity(e.target.value)
      if (e.target.value.toString().length == 0) {
        setQuantityError("Please enter product quantity.")
      } else {
        setQuantityError("")
      }
    }
    if (e.target.id == "vendor-id") {
      setVendorId(e.target.value)
      if (e.target.value.length == 0) {
        setVendorIdError("Please select vendor Id.")
      } else {
        setVendorIdError("")
      }
    }
    if (e.target.id == "category") {
      setCategory(e.target.value)
      if (e.target.value.length == 0) {
        setCategoryError("Please select category.")
      } else {
        setCategoryError("")
      }
    }
  }

  return (
    <div>
      {/* <p>Product List Page</p> */}
      <div className="product">
        {/* Sidebar */}
        <Sidebar />

        <div className="productSection">
          <div className="productInnerSection">
            {/* Navbar */}
            <Navbar />

            {/* Navigation */}
            {/* <Navigation page="Products" /> */}

            {/* Add Product Button */}
            {(loginUserRole == "Super Admin" || loginUserRole == "Vendor") && (
              <AddButton page="Products" name="+ Add Product" setShowModal={setShowModal} />
            )}

            {/* Search Product */}
            <Search
              search={search}
              table={"Product"}
              setSearch={setSearch}
              searchFun={searchFun}
              nameAccendingOrder={nameAccendingOrder}
              nameDecendingOrder={nameDecendingOrder}
              priceAccendingOrder={priceAccendingOrder}
              priceDecendingOrder={priceDecendingOrder}
              vendorIdAccendingOrder={vendorIdAccendingOrder}
              vendorIdDecendingOrder={vendorIdDecendingOrder}
              quantityAccendingOrder={quantityAccendingOrder}
              quantityDecendingOrder={quantityDecendingOrder}
              categoryFilter={(e,categoryName)=>categoryFilter(e,categoryName)}
              categoryFilterActive={categoryFilterActive}
              allCategoryFilter={allCategoryFilter}
              allCategoryFilterActive={allCategoryFilterActive}
            />

            {/* Product Table */}
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
                      {/* <th>Price</th> */}
                      {priceAccendingOrderActive == false && priceDecendingOrderActive == true ? (
                        <th onClick={(e) => priceAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Price</p>
                            <Image src={DecendingSelectArrowIcon} alt="DecendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : priceAccendingOrderActive == true && priceDecendingOrderActive == false ? (
                        <th onClick={(e) => priceDecendingOrder(e)}>
                          <div className="tableDecendingOrderBtn">
                            <p>Price</p>
                            <Image src={AccendingSelectArrowIcon} alt="AccendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : (
                        <th onClick={(e) => priceAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Price</p>
                            <Image src={DisableSelectArrowIcon} alt="DisableSelectArrowIcon" />
                          </div>
                        </th>
                      )}
                      {/* <th>Vendor</th> */}
                      {vendorIdAccendingOrderActive == false && vendorIdDecendingOrderActive == true ? (
                        <th onClick={(e) => vendorIdAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Vendor</p>
                            <Image src={DecendingSelectArrowIcon} alt="DecendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : vendorIdAccendingOrderActive == true && vendorIdDecendingOrderActive == false ? (
                        <th onClick={(e) => vendorIdDecendingOrder(e)}>
                          <div className="tableDecendingOrderBtn">
                            <p>Vendor</p>
                            <Image src={AccendingSelectArrowIcon} alt="AccendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : (
                        <th onClick={(e) => vendorIdAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Vendor</p>
                            <Image src={DisableSelectArrowIcon} alt="DisableSelectArrowIcon" />
                          </div>
                        </th>
                      )}
                      {/* <th>Quantity</th> */}
                      {quantityAccendingOrderActive == false && quantityDecendingOrderActive == true ? (
                        <th onClick={(e) => quantityAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Quantity</p>
                            <Image src={DecendingSelectArrowIcon} alt="DecendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : quantityAccendingOrderActive == true && quantityDecendingOrderActive == false ? (
                        <th onClick={(e) => quantityDecendingOrder(e)}>
                          <div className="tableDecendingOrderBtn">
                            <p>Quantity</p>
                            <Image src={AccendingSelectArrowIcon} alt="AccendingSelectArrowIcon" />
                          </div>
                        </th>
                      ) : (
                        <th onClick={(e) => quantityAccendingOrder(e)}>
                          <div className="tableAccendingOrderBtn">
                            <p>Quantity</p>
                            <Image src={DisableSelectArrowIcon} alt="DisableSelectArrowIcon" />
                          </div>
                        </th>
                      )}
                      <th>Description</th>
                      <th>Category</th>
                      {loginUserRole == "Super Admin" || loginUserRole == "Vendor" ? (
                        <th>Action</th>
                      ) : (
                        ""
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {products != "" ? (
                      products
                        .filter((item) => {
                          if (search.toLowerCase() === "") {
                            return item
                          } else {
                            if (item.name.toLowerCase().match(search.toLowerCase())) {
                              return item.name.toLowerCase().includes(search.toLowerCase())
                            } else if (item.price.toString().match(search.toString())) {
                              return item.price.toString().includes(search.toString())
                            } else if (item.vendorId.toLowerCase().match(search.toLowerCase())) {
                              return item.vendorId.toLowerCase().includes(search.toLowerCase())
                            } else if (item.quantity.toString().match(search.toString())) {
                              return item.quantity.toString().includes(search.toString())
                            } else if (
                              item.productDescription.toLowerCase().match(search.toLowerCase())
                            ) {
                              return item.productDescription
                                .toLowerCase()
                                .includes(search.toLowerCase())
                            } else if (item.category.toLowerCase().match(search.toLowerCase())) {
                              return item.category.toLowerCase().includes(search.toLowerCase())
                            }
                          }
                        })
                        .slice(itemOffset, endOffset)
                        .map((item, index) => (
                          <tr key={index}>
                            <td>{endOffset - itemsPerPage + index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{item.vendorId}</td>
                            <td>{item.quantity}</td>
                            <td>{item.productDescription}</td>
                            <td>{item.category}</td>
                            {loginUserRole == "Super Admin" || loginUserRole == "Vendor" ? (
                              <>
                                <td className="tableAction">
                                  {(loginUserRole == "Vendor" && item.vendorId == loginUserEmail) ||
                                  loginUserRole == "Super Admin" ? (
                                    <>
                                      <button
                                        className="tableEditBtn"
                                        onClick={() =>
                                          editProduct(
                                            item._id,
                                            item.name,
                                            item.price,
                                            item.productDescription,
                                            item.quantity,
                                            item.vendorId,
                                            item.category
                                          )
                                        }
                                      >
                                        {/* Edit */}
                                        <Image src={TableEditIcon} alt="TableEditIcon" />
                                      </button>
                                      {loginUserRole == "Vendor" && item.vendorId == loginUserEmail
                                        ? (vendorProductCount += 1)
                                          ? ""
                                          : ""
                                        : ""}
                                      <DeleteProduct id={item._id} />
                                    </>
                                  ) : (
                                    <>
                                      <button className="tableDisableEditBtn">
                                        {/* Edit */}
                                        <Image
                                          src={TableDisableEditIcon}
                                          alt="TableDisableEditIcon"
                                        />
                                      </button>
                                      <button className="tableDisableDeleteBtn">
                                        {/* Delete */}
                                        <Image
                                          src={TableDisableDeleteIcon}
                                          alt="TableDisableDeleteIcon"
                                        />
                                      </button>
                                    </>
                                  )}
                                </td>
                              </>
                            ) : (
                              ""
                            )}
                          </tr>
                        ))
                    ) : (
                      <tr className="no-data">
                        <td colSpan={8} align="center">
                          No Product
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

      {/* Add Product Modal */}
      <Modal show={showModal} onClose={() => closeBtn()}>
        <div className="addTitle">
          <p>Add Product</p>
        </div>
        <div className="addFormSection">
          <div className="addFormInnerSection">
            <form className="addForm">
              <div className="addFormInputSection">
                <div className="addFormInputFirstSection">
                  <label>Name</label>
                  <input
                    type="text"
                    className={nameError && "errorBorder"}
                    id="name"
                    value={name}
                    onChange={(e) => handler(e)}
                    placeholder="Enter a product name"
                  />
                  {nameError && <p className="errorMsg">{nameError}</p>}
                  <label>Product Description</label>
                  <input
                    type="text"
                    className={productDescriptionError && "errorBorder"}
                    id="product-description"
                    value={productDescription}
                    onChange={(e) => handler(e)}
                    placeholder="Enter a product description"
                  />
                  {productDescriptionError && <p className="errorMsg">{productDescriptionError}</p>}
                  {loginUserRole == "Super Admin" ? (
                    <>
                      <label>Vendor Id</label>
                      <Select
                        value="vendors"
                        id="vendor-id"
                        handler={handler}
                        vendorIdError={vendorIdError}
                        vendorId={vendorId}
                        setVendorId={setVendorId}
                      />
                      {vendorIdError && <p className="errorMsg">{vendorIdError}</p>}
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div className="addFormInputSecondSection">
                  <label>Price</label>
                  <input
                    type="number"
                    className={priceError && "errorBorder"}
                    id="price"
                    value={price}
                    onChange={(e) => handler(e)}
                    placeholder="Enter a product price"
                  />
                  {priceError && <p className="errorMsg">{priceError}</p>}
                  <label>Quantity</label>
                  <input
                    type="number"
                    className={quantityError && "errorBorder"}
                    id="quantity"
                    value={quantity}
                    onChange={(e) => handler(e)}
                    placeholder="Enter a quantity"
                  />
                  {quantityError && <p className="errorMsg">{quantityError}</p>}
                  {loginUserRole == "Super Admin" ? (
                    <>
                      <label>Category</label>
                      <Select
                        value="categories"
                        id="category"
                        handler={handler}
                        categoryError={categoryError}
                        category={category}
                        setCategory={setCategory}
                      />
                      {categoryError && <p className="errorMsg">{categoryError}</p>}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {loginUserRole == "Vendor" ? (
                <>
                  <div className="addFormInputThirdSection">
                    <label>Category</label>
                    <Select
                      value="categories"
                      id="category"
                      handler={handler}
                      categoryError={categoryError}
                      category={category}
                      setCategory={setCategory}
                    />
                    {categoryError && <p className="errorMsg">{categoryError}</p>}
                  </div>
                </>
              ) : (
                ""
              )}
              <div className="addModalBtnSection">
                <button type="submit" onClick={(e) => addProduct(e)} className="addModalBtn">
                  + Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      {/* Update Product Modal */}
      <Modal show={editShawModal} onClose={() => closeBtn()}>
        <div className="updateTitle">
          <p>Update Product</p>
        </div>
        <div className="updateFormSection">
          <div className="updateFormInnerSection">
            <form className="updateForm">
              <div className="updateFormInputSection">
                <div className="updateFormInputFirstSection">
                  <label>Name</label>
                  <input
                    type="text"
                    className={nameError && "errorBorder"}
                    id="name"
                    value={name}
                    onChange={(e) => handler(e)}
                    placeholder="Enter a product name"
                  />
                  {nameError && <p className="errorMsg">{nameError}</p>}
                  <label>Product Description</label>
                  <input
                    type="text"
                    className={productDescriptionError && "errorBorder"}
                    id="product-description"
                    value={productDescription}
                    onChange={(e) => handler(e)}
                    placeholder="Enter a product description"
                  />
                  {productDescriptionError && <p className="errorMsg">{productDescriptionError}</p>}
                  {loginUserRole == "Super Admin" ? (
                    <>
                      <label>Vendor Id</label>
                      <Select
                        value="vendors"
                        id="vendor-id"
                        handler={handler}
                        vendorIdError={vendorIdError}
                        vendorId={vendorId}
                        setVendorId={setVendorId}
                      />
                      {vendorIdError && <p className="errorMsg">{vendorIdError}</p>}
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div className="updateFormInputSecondSection">
                  <label>Price</label>
                  <input
                    type="number"
                    className={priceError && "errorBorder"}
                    id="price"
                    value={price}
                    onChange={(e) => handler(e)}
                    placeholder="Enter a product price"
                  />
                  {priceError && <p className="errorMsg">{priceError}</p>}
                  <label>Quantity</label>
                  <input
                    type="number"
                    className={quantityError && "errorBorder"}
                    id="quantity"
                    value={quantity}
                    onChange={(e) => handler(e)}
                    placeholder="Enter a quantity"
                  />
                  {quantityError && <p className="errorMsg">{quantityError}</p>}
                  {loginUserRole == "Super Admin" ? (
                    <>
                      <label>Category</label>
                      <Select
                        value="categories"
                        id="category"
                        handler={handler}
                        categoryError={categoryError}
                        category={category}
                        setCategory={setCategory}
                      />
                      {categoryError && <p className="errorMsg">{categoryError}</p>}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {loginUserRole == "Vendor" ? (
                <>
                  <div className="updateFormInputThirdSection">
                    <label>Category</label>
                    <Select
                      value="categories"
                      id="category"
                      handler={handler}
                      categoryError={categoryError}
                      category={category}
                      setCategory={setCategory}
                    />
                    {categoryError && <p className="errorMsg">{categoryError}</p>}
                  </div>
                </>
              ) : (
                ""
              )}
              <div className="updateModalBtnSection">
                <button type="submit" onClick={(e) => updateProduct(e)} className="updateModalBtn">
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
