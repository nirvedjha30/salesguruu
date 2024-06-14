"use client"
import dynamic from "next/dynamic"
import "chart.js/auto"
// import "./../styles/barchart.css"
import "./../styles/piechart.css"
import { useEffect, useState } from "react"
export default function PieChart(props) {
  // ========================Chart Loading==============================
  const [chartLoad, setChartLoad] = useState(false)
  // ===================================================================

  const Pie = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), {
    ssr: false,
  })
  const piechartdata = {
    labels: ["Account Manager", "Vendor", "Employee", "Product"],
    datasets: [
      {
        label: "Bar Chart",
        data: [props.accountManagers, props.vendors, props.employees, props.products],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  useEffect(() => {
    if (localStorage.getItem("id")) {
      setTimeout(() => {
        setChartLoad(true)
      }, 1000)
    }
  })

  return (
    <div className="piechart">
      <div className="piechartTitleSection">
        <div className="piechartTitleInnerSection">
          <p>Pie Chart</p>
        </div>
      </div>
      <div className="piechartChartSection">
        <div className="piechartChartInnerSection">
          {chartLoad ? <Pie data={piechartdata} /> : ""}
        </div>
      </div>
    </div>
  )
}
