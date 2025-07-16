import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const PostEngagementAreaChart = ({ data }) => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Convert objects to sorted array
  const labels = Object.keys(data?.posts || {}).sort();

  const series = [
    {
      name: "Posts",
      data: labels.map((label) => data?.posts?.[label] || 0),
    },
    {
      name: "Likes",
      data: labels.map((label) => data?.likes?.[label] || 0),
    },
    {
      name: "Comments",
      data: labels.map((label) => data?.comments?.[label] || 0),
    },
  ];

  const options = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 500,
      },
    },
    colors: ["#16a34a", "#2563eb", "#9333ea"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          colors: isDark ? "#FFFFFF" : "#6B7280",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? "#FFFFFF" : "#6B7280",
        },
      },
      title: {
        text: "Count",
        style: {
          color: isDark ? "#FFFFFF" : "#6B7280",
        },
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
    },
    legend: {
      labels: {
        colors: isDark ? "#FFFFFF" : "#6B7280",
      },
    },
  };

  return (
    <div className="px-4 pb-4">
      <ReactApexChart
        key={isDark ? "dark" : "light"}
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default PostEngagementAreaChart;
