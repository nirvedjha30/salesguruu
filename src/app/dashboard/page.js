"use client"
import "../../styles/dashboard.css"
import "../../styles/table.css"
import "../../styles/pagination.css"
import Navbar from "@/components/Navebar"
import Sidebar from "@/components/Sidebar"
import Footer from "@/components/Footer"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Navigation from "@/components/Navigation"
import DashboardCard from "@/components/DashboardCard"
import dynamic from "next/dynamic"
import "chart.js/auto"
import Search from "@/components/Search"
import ReactPaginate from "react-paginate"
import BarChart from "@/components/BarChart"
import LineChart from "@/components/LineChart"
import "../../styles/linechart.css"
import "../../styles/barchart.css"
import Image from "next/image"
import AccendingSelectArrowIcon from "../../../public/accending-select-arrow.svg"
import DecendingSelectArrowIcon from "../../../public/decending-select-arrow.svg"
import DisableSelectArrowIcon from "../../../public/disable-select-arrow.svg"
import PieChart from "@/components/PieChart"

const { NEXT_PUBLIC_url } = process.env

export default function Page() {
  const router = useRouter()

  // ====================================================
  const [loginUserRole, setLoginUserRole] = useState(localStorage.getItem("role"))
  const [loginUserId, setloginUserId] = useState(localStorage.getItem("id"))
  const [loginUserEmail, setLoginUserEmail] = useState(localStorage.getItem("email"))
  // ====================================================

  const [productsTable, setProductsTable] = useState([])
  const [filterProductsTable, setFilterProductsTable] = useState([])

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

  const [accountManagers, setAccountManagers] = useState(0)
  const [vendors, setVendors] = useState(0)
  const [employees, setEmployees] = useState(0)
  const [products, setProducts] = useState(0)

  useEffect(() => {
    ;(async () => {
      if (!localStorage.getItem("id")) {
        router.push("/")
      } else {
        const accountManager = await getAccountManagers()
        setAccountManagers(accountManager.length)
        const vendor = await getVendors()
        setVendors(vendor.length)
        const employee = await getEmployees()
        setEmployees(employee.length)
        const product = await getProducts()
        setProducts(product.length)
        const productTable = await getProducts()
        // setProductsTable(productTable)
        setProductsTable([...productTable].sort((a, b) => (a.name < b.name ? -1 : 1)))
        setFilterProductsTable([...productTable].sort((a, b) => (a.name < b.name ? -1 : 1)))
        setNameAccendingOrderActive(true)
        setNameDecendingOrderActive(false)
      }
    })()
  }, [])

  const getAccountManagers = async () => {
    let data = await fetch(`${NEXT_PUBLIC_url}/api/super-admin/account-manager`, {
      cache: "no-cache",
    })
    data = await data.json()
    if (data.success) {
      return data.result
    } else {
      return { success: false }
    }
  }

  const getVendors = async () => {
    let data = await fetch(`${NEXT_PUBLIC_url}/api/super-admin/vendor`, { cache: "no-cache" })
    data = await data.json()
    if (data.success) {
      return data.result
    } else {
      return { success: false }
    }
  }

  const getEmployees = async () => {
    let data = await fetch(`${NEXT_PUBLIC_url}/api/employee`, { cache: "no-cache" })
    data = await data.json()
    if (data.success) {
      return data.result
    } else {
      return { success: false }
    }
  }

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
    setProductsTable([...productsTable].sort((a, b) => (a.name < b.name ? -1 : 1)))
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
    setProductsTable([...productsTable].sort((a, b) => (a.name > b.name ? -1 : 1)))
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
    setProductsTable([...productsTable].sort((a, b) => (a.price < b.price ? -1 : 1)))
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
    setProductsTable([...productsTable].sort((a, b) => (a.price > b.price ? -1 : 1)))
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
    setProductsTable([...productsTable].sort((a, b) => (a.vendorId < b.vendorId ? -1 : 1)))
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
    setProductsTable([...productsTable].sort((a, b) => (a.vendorId > b.vendorId ? -1 : 1)))
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
    setProductsTable([...productsTable].sort((a, b) => (a.quantity < b.quantity ? -1 : 1)))
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
    setProductsTable([...productsTable].sort((a, b) => (a.quantity > b.quantity ? -1 : 1)))
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
  const categoryFilter = (e, categoryName) => {
    e.preventDefault()
    setProductsTable([...filterProductsTable].filter((a) => a.category == categoryName))
    setCategoryFilterActive(categoryName)
    setAllCategoryFilterActive(false)
  }

  const allCategoryFilter = (e) => {
    e.preventDefault()
    setProductsTable([...filterProductsTable])
    setAllCategoryFilterActive(true)
    setCategoryFilterActive("")
  }
  // ========================================================================

  // ===================== Pagination =========================

  const items = productsTable

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

  return (
    <div>
      {/* <p>Dashboard Page</p> */}
      <div className="dashboard">
        {/* Sidebar */}
        <Sidebar />

        <div className="dashboardSection">
          <div className="dashboardInnerSection">
            {/* Navbar */}
            <Navbar />

            {/* Navigation */}
            <Navigation page="Dashboard" />

            {/* Dashboard Card */}
            <div className="dashboardCardSection">
              <div className="dashboardCardInnerSection">
                <DashboardCard
                  cardName="Account Manager"
                  total={accountManagers}
                  moreInfoLink={
                    loginUserRole == "Super Admin" || loginUserRole == "Account Manager"
                      ? "/account-manager"
                      : ""
                  }
                  cardClassName="cardAccountManager"
                  moreInfoClassName="moreInfoAccountManager"
                />

                <DashboardCard
                  cardName="Vendor"
                  total={vendors}
                  moreInfoLink={
                    loginUserRole == "Super Admin" ||
                    loginUserRole == "Account Manager" ||
                    loginUserRole == "Vendor"
                      ? "/vendor"
                      : ""
                  }
                  cardClassName="cardVendor"
                  moreInfoClassName="moreInfoVendor"
                />

                <DashboardCard
                  cardName="Employee"
                  total={employees}
                  moreInfoLink="/employee"
                  cardClassName="cardEmployee"
                  moreInfoClassName="moreInfoEmployee"
                />

                <DashboardCard
                  cardName="Product"
                  total={products}
                  moreInfoLink="/product"
                  cardClassName="cardProduct"
                  moreInfoClassName="moreInfoProduct"
                />
              </div>
            </div>

            <div className="chartSection">
              <div className="chartInnerSection">
                {/* LineChart */}
                <LineChart
                  accountManagers={accountManagers}
                  vendors={vendors}
                  employees={employees}
                  products={products}
                />

                {/* BarChart */}
                <BarChart
                  accountManagers={accountManagers}
                  vendors={vendors}
                  employees={employees}
                  products={products}
                />
              </div>
            </div>

            <div className="productTableSection">
              <div className="productTableInnerSection">
                {/* PieChart */}
                <PieChart
                  accountManagers={accountManagers}
                  vendors={vendors}
                  employees={employees}
                  products={products}
                />

                {/* Product Table */}
                <div className="productTable">
                  <div className="productTableTitleSection">
                    <div className="productTableTitleInnerSection">
                      <p>Products</p>
                    </div>
                  </div>

                  {/* Search Product */}
                  <Search
                    search={search}
                    table={"Product"}
                    setSearch={setSearch}
                    searchFun={searchFun}
                    categoryFilter={(e, categoryName) => categoryFilter(e, categoryName)}
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
                            {nameAccendingOrderActive == false &&
                            nameDecendingOrderActive == true ? (
                              <th onClick={(e) => nameAccendingOrder(e)}>
                                <div className="tableAccendingOrderBtn">
                                  <p>Name</p>
                                  <Image
                                    src={DecendingSelectArrowIcon}
                                    alt="DecendingSelectArrowIcon"
                                  />
                                </div>
                              </th>
                            ) : nameAccendingOrderActive == true &&
                              nameDecendingOrderActive == false ? (
                              <th onClick={(e) => nameDecendingOrder(e)}>
                                <div className="tableDecendingOrderBtn">
                                  <p>Name</p>
                                  <Image
                                    src={AccendingSelectArrowIcon}
                                    alt="AccendingSelectArrowIcon"
                                  />
                                </div>
                              </th>
                            ) : (
                              <th onClick={(e) => nameAccendingOrder(e)}>
                                <div className="tableAccendingOrderBtn">
                                  <p>Name</p>
                                  <Image
                                    src={DisableSelectArrowIcon}
                                    alt="DisableSelectArrowIcon"
                                  />
                                </div>
                              </th>
                            )}
                            {/* <th>Price</th> */}
                            {priceAccendingOrderActive == false &&
                            priceDecendingOrderActive == true ? (
                              <th onClick={(e) => priceAccendingOrder(e)}>
                                <div className="tableAccendingOrderBtn">
                                  <p>Price</p>
                                  <Image
                                    src={DecendingSelectArrowIcon}
                                    alt="DecendingSelectArrowIcon"
                                  />
                                </div>
                              </th>
                            ) : priceAccendingOrderActive == true &&
                              priceDecendingOrderActive == false ? (
                              <th onClick={(e) => priceDecendingOrder(e)}>
                                <div className="tableDecendingOrderBtn">
                                  <p>Price</p>
                                  <Image
                                    src={AccendingSelectArrowIcon}
                                    alt="AccendingSelectArrowIcon"
                                  />
                                </div>
                              </th>
                            ) : (
                              <th onClick={(e) => priceAccendingOrder(e)}>
                                <div className="tableAccendingOrderBtn">
                                  <p>Price</p>
                                  <Image
                                    src={DisableSelectArrowIcon}
                                    alt="DisableSelectArrowIcon"
                                  />
                                </div>
                              </th>
                            )}
                            {/* <th>Vendor</th> */}
                            {vendorIdAccendingOrderActive == false &&
                            vendorIdDecendingOrderActive == true ? (
                              <th onClick={(e) => vendorIdAccendingOrder(e)}>
                                <div className="tableAccendingOrderBtn">
                                  <p>Vendor</p>
                                  <Image
                                    src={DecendingSelectArrowIcon}
                                    alt="DecendingSelectArrowIcon"
                                  />
                                </div>
                              </th>
                            ) : vendorIdAccendingOrderActive == true &&
                              vendorIdDecendingOrderActive == false ? (
                              <th onClick={(e) => vendorIdDecendingOrder(e)}>
                                <div className="tableDecendingOrderBtn">
                                  <p>Vendor</p>
                                  <Image
                                    src={AccendingSelectArrowIcon}
                                    alt="AccendingSelectArrowIcon"
                                  />
                                </div>
                              </th>
                            ) : (
                              <th onClick={(e) => vendorIdAccendingOrder(e)}>
                                <div className="tableAccendingOrderBtn">
                                  <p>Vendor</p>
                                  <Image
                                    src={DisableSelectArrowIcon}
                                    alt="DisableSelectArrowIcon"
                                  />
                                </div>
                              </th>
                            )}
                            {/* <th>Quantity</th> */}
                            {quantityAccendingOrderActive == false &&
                            quantityDecendingOrderActive == true ? (
                              <th onClick={(e) => quantityAccendingOrder(e)}>
                                <div className="tableAccendingOrderBtn">
                                  <p>Quantity</p>
                                  <Image
                                    src={DecendingSelectArrowIcon}
                                    alt="DecendingSelectArrowIcon"
                                  />
                                </div>
                              </th>
                            ) : quantityAccendingOrderActive == true &&
                              quantityDecendingOrderActive == false ? (
                              <th onClick={(e) => quantityDecendingOrder(e)}>
                                <div className="tableDecendingOrderBtn">
                                  <p>Quantity</p>
                                  <Image
                                    src={AccendingSelectArrowIcon}
                                    alt="AccendingSelectArrowIcon"
                                  />
                                </div>
                              </th>
                            ) : (
                              <th onClick={(e) => quantityAccendingOrder(e)}>
                                <div className="tableAccendingOrderBtn">
                                  <p>Quantity</p>
                                  <Image
                                    src={DisableSelectArrowIcon}
                                    alt="DisableSelectArrowIcon"
                                  />
                                </div>
                              </th>
                            )}
                            <th>Description</th>
                            <th>Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productsTable != "" ? (
                            productsTable
                              .filter((item) => {
                                if (search.toLowerCase() === "") {
                                  return item
                                } else {
                                  if (item.name.toLowerCase().match(search.toLowerCase())) {
                                    return item.name.toLowerCase().includes(search.toLowerCase())
                                  } else if (item.price.toString().match(search.toString())) {
                                    return item.price.toString().includes(search.toString())
                                  } else if (
                                    item.vendorId.toLowerCase().match(search.toLowerCase())
                                  ) {
                                    return item.vendorId
                                      .toLowerCase()
                                      .includes(search.toLowerCase())
                                  } else if (item.quantity.toString().match(search.toString())) {
                                    return item.quantity.toString().includes(search.toString())
                                  } else if (
                                    item.productDescription
                                      .toLowerCase()
                                      .match(search.toLowerCase())
                                  ) {
                                    return item.productDescription
                                      .toLowerCase()
                                      .includes(search.toLowerCase())
                                  } else if (
                                    item.category.toLowerCase().match(search.toLowerCase())
                                  ) {
                                    return item.category
                                      .toLowerCase()
                                      .includes(search.toLowerCase())
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
                        {items.length >= endOffset ? endOffset : items.length} of {items.length}{" "}
                        entries
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
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  )
}
