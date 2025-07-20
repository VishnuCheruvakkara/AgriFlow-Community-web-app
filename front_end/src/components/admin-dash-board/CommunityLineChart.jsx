import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const CommunityLineChart = ({ data }) => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
    return () => observer.disconnect();
  }, []);

  const dates = Array.from(
    new Set([
      ...Object.keys(data?.created || {}),
      ...Object.keys(data?.joined || {}),
      ...Object.keys(data?.messages || {})
    ])
  ).sort();

  const series = [
    {
      name: "Communities Created",
      data: dates.map((d) => data?.created?.[d] || 0)
    },
    {
      name: "Memberships Joined",
      data: dates.map((d) => data?.joined?.[d] || 0)
    },
    {
      name: "Messages Sent",
      data: dates.map((d) => data?.messages?.[d] || 0)
    }
  ];

  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      animations: { enabled: true, easing: "easeinout", speed: 500 }
    },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: dates,
      labels: {
        rotate: 0,
        style: {
          colors: isDark ? "#fff" : "#374151",
          fontSize: "12px"
        }
      },
      title: {
        text: "Date",
        style: { color: isDark ? "#fff" : "#374151" }
      }
    },
    yaxis: {
      title: {
        text: "Count",
        style: { color: isDark ? "#fff" : "#374151" }
      },
      labels: {
        style: { colors: isDark ? "#fff" : "#374151" }
      }
    },
    tooltip: { theme: isDark ? "dark" : "light" },
    legend: {
      labels: { colors: isDark ? "#fff" : "#374151" }
    },
    colors: ["#0b80f5", "#f5ed0b", "#f50b0b"]
  };

  return (
    <ReactApexChart
      key={isDark ? "dark" : "light"}
      options={options}
      series={series}
      type="line"
      height={350}
    />
  );
};

export default CommunityLineChart;
