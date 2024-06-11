"use client"
import "../../styles/add-product.css"
import Navbar from "@/components/Navebar"
import Sidebar from "@/components/Sidebar"
import Footer from "@/components/Footer"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Select from "@/components/Select"
import Navigation from "@/components/Navigation"

const { NEXT_PUBLIC_url } = process.env

export default function Page() {
  const router = useRouter()

  // ====================================================
  const [loginUserRole, setLoginUserRole] = useState(localStorage.getItem("role"))
  const [loginUserId, setloginUserId] = useState(localStorage.getItem("id"))
  const [loginUserEmail, setLoginUserEmail] = useState(localStorage.getItem("email"))
  // ====================================================

  // ===========================================
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [quantity, setQuantity] = useState("")
  const [vendorId, setVendorId] = useState((loginUserRole=="Vendor")? loginUserEmail : "")
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

  useEffect(() => {
    if (
      !localStorage.getItem("id") ||
      (loginUserRole != "Super Admin" && loginUserRole != "Vendor")
    ) {
      router.push("/")
    }
  }, [])

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
        setVendorId((loginUserRole=="Vendor")? loginUserEmail : "")
        setCategory("")
      } else {
        alert("Please Enter all field")
      }
    }
  }
  // ======================================================

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
      {/* <p>Add Product Page</p> */}
      <div className="addProduct">
        {/* Sidebar */}
        <Sidebar />

        <div className="addProductSection">
          <div className="addProductInnerSection">
          {/* Navbar */}
          <Navbar />

          {/* Navigation */}
          <Navigation page="Add Product" />

          {/* Add Product Form */}
          <div className="addProductFormSection">
            <div className="addProductFormInnerSection">
              <form className="addProductForm">
                <div className="addProductFormInputSection">
                  <div className="addProductFormInputFirstSection">
                    <label>Product Name</label>
                    <input
                      type="text"
                      className={nameError && "errorBorder"}
                      id="name"
                      value={name}
                      onChange={(e) => handler(e)}
                      placeholder="Enter a product name"
                    />
                    {nameError && <p className="errorMsg">{nameError}</p>}
                    <label>Description</label>
                    <input
                      type="text"
                      className={productDescriptionError && "errorBorder"}
                      id="product-description"
                      value={productDescription}
                      onChange={(e) => handler(e)}
                      placeholder="Enter a description"
                    />
                    {productDescriptionError && (
                      <p className="errorMsg">{productDescriptionError}</p>
                    )}
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
                  <div className="addProductFormInputSecondSection">
                    <label>Price</label>
                    <input
                      type="number"
                      className={priceError && "errorBorder"}
                      id="price"
                      value={price}
                      onChange={(e) => handler(e)}
                      placeholder="Enter a Price"
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
                    <div className="addProductFormInputThirdSection">
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
                <button type="submit" onClick={(e) => addProduct(e)} className="addProductBtn">
                  + Add Product
                </button>
              </form>
            </div>
          </div>
          </div>
          <Footer />
        </div>
      </div>
      
    </div>
  )
}
