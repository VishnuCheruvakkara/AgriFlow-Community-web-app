import React from "react";
import ReactApexChart from "react-apexcharts";

const ProductMetricsChart = ({ data }) => {
  // Set fallback data to 0 for each category
  const categories = [
    "Total Products",
    "Available Products",
    "Wishlist Items",
    "Chat Messages",
    "Units: Piece",
    "Units: Kg",
    "Units: Litre"
  ];

  const seriesData = [
    data?.total_products || 0,
    data?.available_products || 0,
    data?.wishlist_items || 0,
    data?.chat_messages || 0,
    data?.units_piece || 0,
    data?.units_kg || 0,
    data?.units_litre || 0
  ];

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 600
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories,
      labels: {
        show:false,
      }
    },
    yaxis: {
      title: {
        text: "Count"
      }
    },
    colors: ["#16a34a"],
    tooltip: {
      y: {
        formatter: (val) => `${val} items`
      }
    }
  };

  const series = [
    {
      name: "Count",
      data: seriesData
    }
  ];

  return (
    <div className="px-4 pb-4 mt-10">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default ProductMetricsChart;
