"use client"
import dynamic from "next/dynamic"
import "chart.js/auto"
import "./../styles/barchart.css"
export default function BarChart(props) {
  const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
    ssr: false,
  })
  const barchartdata = {
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

  return (
    <div className="barchart">
      <div className="barchartTitleSection">
        <div className="barchartTitleInnerSection">
          <p>Bar Chart</p>
        </div>
      </div>
      <div className="barchartChartSection">
        <div className="barchartChartInnerSection">
          <Bar data={barchartdata} />
        </div>
      </div>
    </div>
  )
}
