import Image from "next/image"
import FilterIcon from "../../public/filter.svg"
import SearchIcon from "../../public/search.svg"
import SearchDownArrowIcon from "../../public/search-down-arrow.svg"
import "../styles/search.css"
import { useEffect, useState } from "react"
import Link from "next/link"

const { NEXT_PUBLIC_url } = process.env

export default function Search(props) {
  const [categories, setCategories] = useState([])
  const [filterShow, setFilterShow] = useState(false)
  const [filterDropdownShow, setFilterDropdownShow] = useState(false)

  const [clickFilterIcon, setClickFilterIcon] = useState(false)

  const [itemPerPageDropdownShow, setItemPerPageDropdownShow] = useState(false)
  const [clickItemPerPageDropdown, setClickItemPerPageDropdown] = useState(false)

  // ====================================================
  const [genderFilterShow, setGenderFilterShow] = useState(false)
  const [statusFilterShow, setStatusFilterShow] = useState(false)
  const [categoryFilterShow, setCategoryFilterShow] = useState(false)
  // ====================================================

  // ====================================================
  const [loginUserRole, setLoginUserRole] = useState(localStorage.getItem("role"))
  const [loginUserId, setloginUserId] = useState(localStorage.getItem("id"))
  const [loginUserEmail, setLoginUserEmail] = useState(localStorage.getItem("email"))
  // ====================================================

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
          const category = await getCategories()
          setCategories([...category].sort((a, b) => (a.categoryName < b.categoryName ? -1 : 1)))
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

  window.onclick = function () {
    if (clickItemPerPageDropdown) {
      setClickItemPerPageDropdown(false)
    } else {
      if (itemPerPageDropdownShow) {
        setItemPerPageDropdownShow(false)
      }
    }
  }

  /* When the user clicks on the button, 
    toggle between hiding and showing the dropdown content */
  const filterFunction = () => {
    if (filterShow) {
      setFilterShow(false)
    } else {
      setFilterShow(true)
    }
  }

  // const filterDropdownFunction = () => {
  //   if(filterShow) {
  //     setFilterShow(true)
  //     // setFilterDropdownShow(true)
  //   }
  // }

  const onMouseEnter = () => {
    // setDropdown(true);
    setFilterShow(true)
  }

  const onMouseLeave = () => {
    window.onclick = function () {
      setFilterShow(false)
    }
  }

  const genderFilterFunction = () => {
    if (genderFilterShow) {
      setGenderFilterShow(false)
    } else {
      setGenderFilterShow(true)
    }
  }

  const statusFilterFunction = () => {
    if (statusFilterShow) {
      setStatusFilterShow(false)
    } else {
      setStatusFilterShow(true)
    }
  }

  const categoryFilterFunction = () => {
    if (categoryFilterShow) {
      setCategoryFilterShow(false)
    } else {
      setCategoryFilterShow(true)
    }
  }

  const itemPerPageFunction = () => {
    setClickItemPerPageDropdown(true)
    if (itemPerPageDropdownShow) {
      setItemPerPageDropdownShow(false)
    } else {
      setItemPerPageDropdownShow(true)
    }
  }

  return (
    <div className="searchSection">
      <div className="searchInnerSection">
        <div className="filterSection">
          <div className="itemPerPageFilterSection">
            <p>Show</p>

            <button onClick={() => itemPerPageFunction()} className="itemPerPageDropBtn">
              <span>{localStorage.getItem("itemsPerPage")}</span>
              <span>
                <Image
                  className={itemPerPageDropdownShow ? "itemPerPageDropdownUpArrow" : ""}
                  src={SearchDownArrowIcon}
                  alt="SearchDownArrowIcon"
                />
              </span>
            </button>
            {itemPerPageDropdownShow && (
              <div id="itemPerPageDropdown" className="itemperpage-dropdown-content">
                <button value={5} type="button" onClick={(e) => props.searchFun(e)}>
                  5
                </button>
                <button value={10} type="button" onClick={(e) => props.searchFun(e)}>
                  10
                </button>
                <button value={25} type="button" onClick={(e) => props.searchFun(e)}>
                  25
                </button>
                <button value={50} type="button" onClick={(e) => props.searchFun(e)}>
                  50
                </button>
                <button value={100} type="button" onClick={(e) => props.searchFun(e)}>
                  100
                </button>
              </div>
            )}

            <p>entries</p>
          </div>
        </div>

        <div className="filterSection">
          <div className="filterIcon">
            <button onClick={() => filterFunction()} className="filterdropbtn">
              <Image src={FilterIcon} alt="Editicon" />
              <p>Filter</p>
            </button>
            {filterShow && (
              <div
                id="filterDropdown"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className="filter-dropdown-content"
              >
                {props.role == "Employee" ? (
                  <>
                    <button className="innerFilterDropdown" onClick={() => genderFilterFunction()}>
                      <span className="innerFilterDropdownName">Gender</span>
                      <span className="innerFilterDropdownArrow">
                        <Image
                          className={genderFilterShow ? "innerFilterDropdownUpArrow" : ""}
                          src={SearchDownArrowIcon}
                          alt="SearchDownArrowIcon"
                        />
                      </span>
                    </button>
                    {genderFilterShow && (
                      <div id="myDropdown" className="inner-dropdown-content">
                        <button
                          className={props.genderMaleFilterActive == true ? "active" : ""}
                          type="button"
                          onClick={(e) => props.genderMaleFilter(e)}
                        >
                          Male
                        </button>
                        <button
                          className={props.genderFemaleFilterActive == true ? "active" : ""}
                          type="button"
                          onClick={(e) => props.genderFemaleFilter(e)}
                        >
                          Female
                        </button>
                        <button
                          className={props.genderOtherFilterActive == true ? "active" : ""}
                          type="button"
                          onClick={(e) => props.genderOtherFilter(e)}
                        >
                          Other
                        </button>
                      </div>
                    )}
                    <button className="innerFilterDropdown" onClick={() => statusFilterFunction()}>
                      <span className="innerFilterDropdownName">Status</span>
                      <span className="innerFilterDropdownArrow">
                        <Image
                          className={statusFilterShow ? "innerFilterDropdownUpArrow" : ""}
                          src={SearchDownArrowIcon}
                          alt="SearchDownArrowIcon"
                        />
                      </span>
                    </button>
                    {statusFilterShow && (
                      <div id="myDropdown" className="inner-dropdown-content">
                        <button
                          className={props.activeStatusFilterActive == true ? "active" : ""}
                          type="button"
                          onClick={(e) => props.activeStatusFilter(e)}
                        >
                          Active
                        </button>
                        <button
                          className={props.inactiveStatusFilterActive == true ? "active" : ""}
                          type="button"
                          onClick={(e) => props.inactiveStatusFilter(e)}
                        >
                          Inactive
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  ""
                )}
                {props.table == "Product" ? (
                  <>
                    <button
                      className="innerFilterDropdown"
                      onClick={() => categoryFilterFunction()}
                    >
                      <span className="innerFilterDropdownName">Category</span>
                      <span className="innerFilterDropdownArrow">
                        <Image
                          className={categoryFilterShow ? "innerFilterDropdownUpArrow" : ""}
                          src={SearchDownArrowIcon}
                          alt="SearchDownArrowIcon"
                        />
                      </span>
                    </button>

                    {categories != "" ? (
                      <>
                        {categoryFilterShow && (
                          <div id="myDropdown" className="inner-dropdown-content">
                            <button
                              className={props.allCategoryFilterActive == true ? "active" : ""}
                              type="button"
                              onClick={(e) => props.allCategoryFilter(e)}
                            >
                              All
                            </button>
                            {categories.map((item, index) => (
                              <>
                                <button
                                  className={
                                    props.categoryFilterActive == item.categoryName ? "active" : ""
                                  }
                                  type="button"
                                  onClick={(e) => props.categoryFilter(e, item.categoryName)}
                                >
                                  {item.categoryName}
                                </button>
                              </>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="noFilterData">No Category</p>
                      </>
                    )}
                  </>
                ) : (
                  ""
                )}
                {props.role != "Employee" && props.table != "Product" ? (
                  <>
                    <p className="noFilterData">
                      No Filter
                      <br />
                      Available
                    </p>
                  </>
                ) : (
                  ""
                )}
              </div>
            )}
          </div>

          <div className="tableSearch">
            <input
              type="text"
              value={props.search}
              onChange={(e) => props.setSearch(e.target.value)}
              placeholder="Search..."
            />
            <Image src={SearchIcon} alt="Searchicon" />
          </div>
        </div>
      </div>
    </div>
  )
}
