"use client"
import dynamic from "next/dynamic"
import "chart.js/auto"
import "./../styles/linechart.css"
export default function LineChart(props) {
  const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
    ssr: false,
  })
  const linechartdata = {
    labels: ["Account Manager", "Vendor", "Employee", "Product"],
    datasets: [
      {
        label: "Line Chart",
        data: [props.accountManagers, props.vendors, props.employees, props.products],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  return (
    <div className="linechart">
      <div className="linechartTitleSection">
        <div className="linechartTitleInnerSection">
          <p>Line Chart</p>
        </div>
      </div>
      <div className="linechartChartSection">
        <div className="linechartChartInnerSection">
          <Line data={linechartdata} />
        </div>
      </div>
    </div>
  )
}
